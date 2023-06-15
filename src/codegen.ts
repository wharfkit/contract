import {ABI} from '@greymass/eosio'
import * as ts from 'typescript'

import {
    generateImportStatement,
    getFieldTypesFromAbi,
    generateField,
    generateStruct,
    generateInterface,
} from './codegen/helpers'
import {generateNamespace, generateNamespaceName} from './codegen/namespace'
import {generateContractClass} from './codegen/contract'
import {generateTableClass} from './codegen/table'

const printer = ts.createPrinter()

export async function codegen(contractName, abi) {
    const namespaceName = generateNamespaceName(contractName)

    const importCoreStatement = generateImportStatement(
        [
            'APIClient',
            'Asset',
            'AssetType',
            'Checksum256',
            'Name',
            'NameType',
            'Session',
            'Struct',
            'TimePointSec',
            'TransactResult',
            'UInt16',
            'UInt16Type',
            'UInt32',
            'UInt32Type',
            'UInt64',
            'UInt64Type',
            'UInt8',
            'UInt8Type',
        ],
        '@wharfkit/session'
    )
    const importContractStatement = generateImportStatement(
        ['Contract', 'Table', 'TableCursor', 'GetTableRowsOptions'],
        '../src/index'
    )

    const {classDeclaration, interfaces: actionsInterfaces} = generateContractClass(
        ABI.from(abi),
        namespaceName
    )

    const tableClasses: ts.ClassDeclaration[] = []
    const tableInterfaces: ts.InterfaceDeclaration[] = []

    abi.tables.forEach((table) => {
        const {classDeclaration, interfaces} = generateTableClass(
            contractName,
            namespaceName,
            table,
            abi
        )
        tableClasses.push(classDeclaration)
        tableInterfaces.push(...interfaces)
    })

    // Generate tables namespace
    const tableNamespace = generateNamespace(namespaceName, [
        generateNamespace('tables', tableClasses),
    ])

    // Extract fields from the ABI
    const structs = getFieldTypesFromAbi(abi)

    const structDeclarations: ts.ClassDeclaration[] = []

    // Iterate through structs and create struct with fields
    for (const struct of structs) {
        const structMembers: ts.ClassElement[] = []

        for (const field of struct.fields) {
            structMembers.push(
                generateField(
                    field,
                    true,
                    `${namespaceName}.types`,
                    structs.map((struct) => struct.structName)
                )
            )
        }

        structDeclarations.push(generateStruct(struct.structName, true, structMembers))
    }

    // Generate types namespace
    const typesDeclaration = generateNamespace(namespaceName, [
        generateNamespace('types', [
            ...actionsInterfaces,
            ...tableInterfaces,
            ...structDeclarations,
        ]),
    ])

    const sourceFile = ts.factory.createSourceFile(
        [
            importContractStatement,
            importCoreStatement,
            classDeclaration,
            tableNamespace,
            typesDeclaration,
        ],
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
        ts.NodeFlags.None
    )

    return printer.printFile(sourceFile)
}
