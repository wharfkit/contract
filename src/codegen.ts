import {ABI} from '@greymass/eosio'
import * as ts from 'typescript'

import {
    EOSIO_CORE_CLASSES,
    EOSIO_CORE_TYPES,
    generateField,
    generateImportStatement,
    generateStruct,
    getFieldTypesFromAbi,
} from './codegen/helpers'
import {generateNamespace, generateNamespaceName} from './codegen/namespace'
import {generateActions} from './codegen/actions'
import {generateTableClass} from './codegen/table'

const printer = ts.createPrinter()

export async function codegen(contractName, abi) {
    const namespaceName = generateNamespaceName(contractName)

    const importCoreStatement = generateImportStatement(
        [
            'APIClient',
            'Session',
            'Struct',
            'TransactResult',
            ...EOSIO_CORE_CLASSES,
            ...EOSIO_CORE_TYPES,
        ],
        '@wharfkit/session'
    )
    const importContractStatement = generateImportStatement(
        ['Contract', 'Table', 'TableCursor', 'GetTableRowsOptions'],
        '@wharfkit/contract'
    )

    const {methods: actionMethods, interfaces: actionsInterfaces} = generateActions(
        contractName,
        namespaceName,
        ABI.from(abi)
    )

    // Generate actions namespace
    const actionsNamespace = generateNamespace(namespaceName, [
        generateNamespace('actions', actionMethods),
    ])

    const tableClasses: ts.ClassDeclaration[] = []
    const tableInterfaces: ts.InterfaceDeclaration[] = []

    for (const table of abi.tables) {
        const {classDeclaration, interfaces} = await generateTableClass(
            contractName,
            namespaceName,
            table,
            abi
        )
        tableClasses.push(classDeclaration)
        tableInterfaces.push(...interfaces)
    }

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
            structMembers.push(generateField(field, true, `${namespaceName}.types`, abi))
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
            actionsNamespace,
            tableNamespace,
            typesDeclaration,
        ],
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
        ts.NodeFlags.None
    )

    return printer.printFile(sourceFile)
}
