import {ABI} from '@wharfkit/antelope'

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
import {generateContractClass} from './codegen/contract'

const printer = ts.createPrinter()

export async function codegen(contractName, abi) {
    const namespaceName = generateNamespaceName(contractName)

    const importCoreStatement = generateImportStatement(
        [
            'ABI',
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
        ['Contract', 'ContractArgs', 'blobStringToAbi'],
        '../src/index-module' //'@wharfkit/contract'
    )
    
    const {classDeclaration} = await generateContractClass(namespaceName, contractName, abi)

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
        generateNamespace('types', structDeclarations),
    ])

    const sourceFile = ts.factory.createSourceFile(
        [
            importContractStatement,
            importCoreStatement,
            classDeclaration,
            typesDeclaration,
        ],
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
        ts.NodeFlags.None
    )

    return printer.printFile(sourceFile)
}
