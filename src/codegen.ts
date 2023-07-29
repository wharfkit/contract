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
import {abiToBlob} from './utils'

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
        ['Contract as BaseContract', 'ContractArgs', 'blobStringToAbi'],
        '@wharfkit/contract'
    )

    const {classDeclaration} = await generateContractClass(namespaceName, contractName)

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

    // Encode the ABI as a binary hex string
    const abiBlob = abiToBlob(abi)

    // Generate `abiBlob` field
    const abiBlobField = ts.factory.createVariableStatement(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
            [
                ts.factory.createVariableDeclaration(
                    'abiBlob',
                    undefined,
                    undefined,
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier('Blob'),
                            ts.factory.createIdentifier('from')
                        ),
                        undefined,
                        [ts.factory.createStringLiteral(String(abiBlob))]
                    )
                ),
            ],
            ts.NodeFlags.Const
        )
    )

    // Generate `abiBlob` field
    const abiField = ts.factory.createVariableStatement(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
            [
                ts.factory.createVariableDeclaration(
                    'abi',
                    undefined,
                    undefined,
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier('ABI'),
                            ts.factory.createIdentifier('from')
                        ),
                        undefined,
                        [ts.factory.createIdentifier('abiBlob')]
                    )
                ),
            ],
            ts.NodeFlags.Const
        )
    )

    // Generate types namespace
    const namespaceDeclaration = generateNamespace(namespaceName, [
        abiBlobField,
        abiField,
        classDeclaration,
        generateNamespace('types', structDeclarations),
    ])

    const sourceFile = ts.factory.createSourceFile(
        [importContractStatement, importCoreStatement, namespaceDeclaration],
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
        ts.NodeFlags.None
    )

    return printer.printFile(sourceFile)
}
