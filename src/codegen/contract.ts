import * as ts from 'typescript'
import { ABI } from '@wharfkit/session'

import { generateClassDeclaration } from './helpers'
import { abiToBlob } from '../utils'

export async function generateContractClass(namespaceName: string, contractName: string, abi: ABI) {
    // Encode the ABI as a binary hex string
    const abiBlob = abiToBlob(abi)

    // Prepare the member fields of the class
    const classMembers: ts.ClassElement[] = []

    // Generate the private static `abiBlob` member
    const abiField = ts.factory.createPropertyDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword), ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
        'abiBlob',
        undefined,
        undefined,
        ts.factory.createStringLiteral(String(abiBlob)),
    )
    classMembers.push(abiField)

    // Generate the `constructor` member
    const constructorParams: ts.ParameterDeclaration[] = [
        ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            'args',
            undefined,
            ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier('Omit'), 
                [
                  ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('ContractArgs'), undefined),
                  ts.factory.createUnionTypeNode([
                    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('abi')),
                    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('account')),
                  ])
                ]
              ),
            undefined
        )
    ]

    const constructorBody = ts.factory.createBlock([
        ts.factory.createExpressionStatement(
            ts.factory.createCallExpression(
                ts.factory.createSuper(),
                undefined,
                [
                    ts.factory.createObjectLiteralExpression([
                        ts.factory.createPropertyAssignment(
                            'client',
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier('args'),
                                'client'
                            )
                        ),
                        ts.factory.createPropertyAssignment(
                            'abi',
                            ts.factory.createCallExpression(
                                ts.factory.createIdentifier('blobStringToAbi'),
                                undefined,
                                [ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(namespaceName), 'abiBlob')]
                            )
                        ),
                        ts.factory.createPropertyAssignment(
                            'account',
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('Name'), 'from'),
                                undefined,
                                [ts.factory.createStringLiteral(contractName)]
                            )
                        ),
                    ], true)
                ]
            )
        ),
    ], true)

    const constructorMember = ts.factory.createConstructorDeclaration(
        undefined,
        undefined,
        constructorParams,
        constructorBody
    )

    classMembers.push(constructorMember)

    // Construct class declaration
    const classDeclaration = generateClassDeclaration(namespaceName, classMembers, {parent: 'Contract', export: true})

    return { classDeclaration }
}


