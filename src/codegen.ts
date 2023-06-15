import {ABI} from '@greymass/eosio'
import * as ts from 'typescript'

import {
    generateImportStatement,
    getFieldTypesFromAbi,
    generateField,
    generateStruct,
} from './codegen/helpers'
import {generateNamespace, generateNamespaceName} from './codegen/namespace'
import {generateContractClass} from './codegen/contract'
import {generateTableClass} from './codegen/table'

const printer = ts.createPrinter()

export async function codegen(contractName, abi) {
    const namespaceName = generateNamespaceName(contractName)

    const importCoreStatement = generateImportStatement(
        [
            'Struct',
            'Name',
            'NameType',
            'Asset',
            'AssetType',
            'UInt32',
            'UInt32Type',
            'UInt64',
            'UInt64Type',
            'UInt8',
            'UInt8Type',
            'TransactResult',
            'APIClient',
        ],
        '@wharfkit/session'
    )
    const importContractStatement = generateImportStatement(
        ['Contract', 'Table', 'TableCursor'],
        '@wharfkit/contract'
    )

    const classDeclaration = generateContractClass(ABI.from(abi), namespaceName)

    const tableClasses: ts.ClassDeclaration[] = []

    console.log({t: abi.tables})

    abi.tables.forEach((table) => {
        const structName = table.name
        console.log({tableName: structName})

        tableClasses.push(generateTableClass(namespaceName, table, abi))
    })

    // Generate tables namespace
    const tableNamespace = generateNamespace(namespaceName, [
        generateNamespace('tables', tableClasses),
    ])

    // Extract fields from the ABI
    const structs = getFieldTypesFromAbi(abi)

    // console.log({structs})

    const structDeclarations: ts.ClassDeclaration[] = []

    // Iterate through structs and create struct with fields
    for (const struct of structs) {
        const structMembers: ts.ClassElement[] = []

        for (const field of struct.fields) {
            structMembers.push(generateField(field, true))
        }

        structDeclarations.push(generateStruct(struct.structName, true, structMembers))
    }

    // Generate types namespace
    const typesDeclaration = generateNamespace(namespaceName, [
        generateNamespace('types', structDeclarations),
    ])

    const sourceFile = ts.factory.createSourceFile(
        [
            importContractStatement,
            importCoreStatement,
            tableNamespace,
            classDeclaration,
            typesDeclaration,
        ],
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
        ts.NodeFlags.None
    )

    return printer.printFile(sourceFile)
}
