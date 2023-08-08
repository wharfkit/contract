import * as ts from 'typescript'

import {generateClassDeclaration} from './helpers'

export async function generateContractClass(namespaceName: string, contractName: string) {
    // Prepare the member fields of the class
    const classMembers: ts.ClassElement[] = []

    // Generate the `constructor` member
    const constructorParams: ts.ParameterDeclaration[] = [
        ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            'args',
            undefined,
            ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('PartialBy'), [
                ts.factory.createTypeReferenceNode(
                    ts.factory.createIdentifier('ContractArgs'),
                    undefined
                ),
                ts.factory.createUnionTypeNode([
                    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('abi')),
                    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('account')),
                ]),
            ]),
            undefined
        ),
    ]

    const constructorBody = ts.factory.createBlock(
        [
            ts.factory.createExpressionStatement(
                ts.factory.createCallExpression(ts.factory.createSuper(), undefined, [
                    ts.factory.createObjectLiteralExpression(
                        [
                            ts.factory.createPropertyAssignment(
                                'client',
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier('args'),
                                    'client'
                                )
                            ),
                            ts.factory.createPropertyAssignment(
                                'abi',
                                ts.factory.createIdentifier('abi')
                            ),
                            ts.factory.createPropertyAssignment(
                                'account',
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier('Name'),
                                        'from'
                                    ),
                                    undefined,
                                    [ts.factory.createStringLiteral(contractName)]
                                )
                            ),
                        ],
                        true
                    ),
                ])
            ),
        ],
        true
    )

    const constructorMember = ts.factory.createConstructorDeclaration(
        undefined,
        undefined,
        constructorParams,
        constructorBody
    )

    classMembers.push(constructorMember)

    // Construct class declaration
    const classDeclaration = generateClassDeclaration('Contract', classMembers, {
        parent: 'BaseContract',
        export: true,
    })

    return {classDeclaration}
}
