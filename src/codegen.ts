import {ABI} from '@greymass/eosio'
import assert from 'assert'
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

const file = ts.createSourceFile('codegen.ts', '', 7)
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
            'TransactResult',
        ],
        '@wharfkit/session'
    )
    const importContractStatement = generateImportStatement(['Contract'], '@wharfkit/contract')

    const classDeclaration = generateContractClass(ABI.from(abi), namespaceName)

    const tableClasses: ts.ClassDeclaration[] = []

    console.log({t: abi.tables})

    abi.tables.forEach((table) => {
        const structName = table.name
        console.log({tableName: structName})

        tableClasses.push(generateTableClass(table, abi))
    })

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

        // console.log({name: struct.structName})

        structDeclarations.push(generateStruct(struct.structName, true, structMembers))
    }

    // Add your custom namespace and export namespace
    const exportNamespace = generateNamespace('types', structDeclarations)

    const typesDeclaration = generateNamespace(namespaceName, [exportNamespace])

    const sourceFile = ts.factory.createSourceFile(
        [
            importContractStatement,
            importCoreStatement,
            ...tableClasses,
            // classDeclaration,
            // typesDeclaration,
        ],
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
        ts.NodeFlags.None
    )

    return printer.printFile(sourceFile)
}
