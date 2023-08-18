import * as ts from 'typescript'
import * as prettier from 'prettier'

import {
    EOSIO_CORE_CLASSES,
    EOSIO_CORE_TYPES,
    generateImportStatement,
    generateInterface,
    getCoreImports,
} from './codegen/helpers'
import {generateNamespace, generateNamespaceName} from './codegen/namespace'
import {generateContractClass} from './codegen/contract'
import {abiToBlob} from './utils'
import { generateStructClasses } from './codegen/structs'
import { generateActionNamesInterface, generateActionsNamespace } from './codegen/interfaces'

const printer = ts.createPrinter()

export async function codegen(contractName, abi) {
    try {
        const namespaceName = generateNamespaceName(contractName)

        const importContractStatement = generateImportStatement(
            ['ActionOptions', 'Contract as BaseContract', 'ContractArgs', 'PartialBy'],
            '@wharfkit/contract'
        )

        const sessionImports = [
            'ABI',
            'Action',
            'Blob',
            'Struct',
            ...getCoreImports(abi),
        ]

        sessionImports.sort()

        const importCoreStatement = generateImportStatement(
            sessionImports,
            '@wharfkit/session'
        ) 

        const actionNamesInterface = generateActionNamesInterface(abi)

        const actionsNamespace = generateActionsNamespace(abi)

        const {classDeclaration} = await generateContractClass(contractName, abi)

        // Iterate through structs and create struct classes with fields
        const structDeclarations = generateStructClasses(abi)

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
            // actionNamesInterface,
            actionsNamespace,
            classDeclaration,
            generateNamespace('Types', structDeclarations),
        ])

        const sourceFile = ts.factory.createSourceFile(
            [importContractStatement, importCoreStatement, namespaceDeclaration],
            ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
            ts.NodeFlags.None
        )

        const options = await prettier.resolveConfig(process.cwd())
        return prettier.format(printer.printFile(sourceFile), options)

    } catch (e) {
        console.error(`An error occurred while generating the contract code: ${e}`)
    }
}
