import * as ts from 'typescript'

import {Table, Contract} from '../index'
import {findExternalType, generateClassDeclaration, generateInterface} from './helpers'
import {capitalize} from '../utils'

export async function generateTableClass(contractName, namespaceName, table, abi) {
    const tableName = table.name
    const struct = abi.structs.find((struct) => struct.name === table.type)
    const members: ts.ClassElement[] = []
    const rowType = `${namespaceName}.types.${capitalize(struct.name)}`

    const tableInstance = Table.from({
        name: tableName,
        contract: Contract.from({name: contractName, abi}),
    })
    const fieldToIndexMapping = await tableInstance.getFieldToIndex()

    // Define fieldToIndex static property
    const fieldToIndex = ts.factory.createPropertyDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
        'fieldToIndex',
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            Object.keys(fieldToIndexMapping).map((keyName, index) => {
                return ts.factory.createPropertyAssignment(
                    keyName,
                    ts.factory.createObjectLiteralExpression([
                        ts.factory.createPropertyAssignment(
                            'type',
                            ts.factory.createStringLiteral(fieldToIndexMapping[keyName].type)
                        ),
                        ts.factory.createPropertyAssignment(
                            'index_position',
                            ts.factory.createStringLiteral(
                                fieldToIndexMapping[keyName].index_position
                            )
                        ),
                    ])
                )
            })
        )
    )
    members.push(fieldToIndex)

    // Create 'where', 'find' and 'all' methods
    ;['where', 'find', 'first', 'cursor', 'all'].forEach((method) => {
        const parameters: ts.ParameterDeclaration[] = []
        const baseClassParameters: ts.Identifier[] = []

        if (method === 'where') {
            parameters.push(
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier('queryParams'),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        `${namespaceName}.types.${capitalize(tableName)}WhereQueryParams`
                    ),
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier('getTableRowsOptions'),
                    undefined,
                    ts.factory.createTypeReferenceNode('GetTableRowsOptions'),
                    undefined
                )
            )
            baseClassParameters.push(
                ts.factory.createIdentifier('queryParams'),
                ts.factory.createIdentifier('getTableRowsOptions')
            )
        } else if (method === 'find') {
            parameters.push(
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier('queryParams'),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        `${namespaceName}.types.${capitalize(tableName)}FindQueryParams`
                    ),
                    undefined
                )
            )
            baseClassParameters.push(ts.factory.createIdentifier('queryParams'))
        } else if (method === 'first') {
            parameters.push(
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier('limit'),
                    undefined,
                    ts.factory.createTypeReferenceNode('number'),
                    undefined
                )
            )
            baseClassParameters.push(ts.factory.createIdentifier('limit'))
        }

        parameters.push(
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier('client'),
                undefined,
                ts.factory.createTypeReferenceNode('APIClient'),
                undefined
            )
        )

        const methodBody = ts.factory.createBlock(
            [
                ts.factory.createVariableStatement(
                    undefined,
                    ts.factory.createVariableDeclarationList(
                        [
                            ts.factory.createVariableDeclaration(
                                ts.factory.createIdentifier(`${tableName.toLowerCase()}Table`),
                                undefined,
                                undefined,
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier('Table'),
                                        ts.factory.createIdentifier('from')
                                    ),
                                    undefined,
                                    [
                                        ts.factory.createObjectLiteralExpression([
                                            ts.factory.createPropertyAssignment(
                                                'contract',
                                                ts.factory.createCallExpression(
                                                    ts.factory.createPropertyAccessExpression(
                                                        ts.factory.createIdentifier('Contract'),
                                                        ts.factory.createIdentifier('from')
                                                    ),
                                                    undefined,
                                                    [
                                                        ts.factory.createObjectLiteralExpression([
                                                            ts.factory.createPropertyAssignment(
                                                                'name',
                                                                ts.factory.createStringLiteral(
                                                                    contractName
                                                                )
                                                            ),
                                                            ts.factory.createPropertyAssignment(
                                                                'client',
                                                                ts.factory.createIdentifier(
                                                                    'client'
                                                                )
                                                            ),
                                                        ]),
                                                    ]
                                                )
                                            ),
                                            ts.factory.createPropertyAssignment(
                                                'name',
                                                ts.factory.createStringLiteral(
                                                    tableName.toLowerCase()
                                                )
                                            ),
                                            ts.factory.createPropertyAssignment(
                                                'rowType',
                                                ts.factory.createIdentifier(rowType)
                                            ),
                                            ts.factory.createPropertyAssignment(
                                                'fieldToIndex',
                                                ts.factory.createPropertyAccessExpression(
                                                    ts.factory.createIdentifier(tableName),
                                                    ts.factory.createIdentifier('fieldToIndex')
                                                )
                                            ),
                                        ]),
                                    ]
                                )
                            ),
                        ],
                        ts.NodeFlags.Const
                    )
                ),
                ts.factory.createReturnStatement(
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier(`${tableName.toLowerCase()}Table`),
                            ts.factory.createIdentifier(method)
                        ),
                        undefined,
                        baseClassParameters
                    )
                ),
            ],
            true
        )

        let returnedType: string

        if (method === 'find') {
            returnedType = `Promise<${rowType}>`
        } else if (method === 'all') {
            returnedType = `Promise<${rowType}[]>`
        } else {
            returnedType = `TableCursor<${rowType}>`
        }

        const methodDeclaration = ts.factory.createMethodDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)], // decorators
            undefined, // modifiers
            ts.factory.createIdentifier(method), // name
            undefined,
            undefined, // questionToken
            parameters, // parameters
            ts.factory.createTypeReferenceNode(returnedType), // return type
            methodBody
        )
        members.push(methodDeclaration)
    })

    // Construct class declaration
    const classDeclaration = generateClassDeclaration(tableName, members, {export: true})

    const interfaces: ts.InterfaceDeclaration[] = [
        generateInterface(
            `${capitalize(tableName)}WhereQueryParams`,
            true,
            struct.fields.map((field) =>
                ts.factory.createPropertySignature(
                    undefined,
                    field.name,
                    ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeLiteralNode([
                        ts.factory.createPropertySignature(
                            undefined,
                            'from',
                            undefined,
                            ts.factory.createTypeReferenceNode(findExternalType(field.type, abi))
                        ),
                        ts.factory.createPropertySignature(
                            undefined,
                            'to',
                            undefined,
                            ts.factory.createTypeReferenceNode(findExternalType(field.type, abi))
                        ),
                    ])
                )
            )
        ),
        generateInterface(
            `${capitalize(tableName)}FindQueryParams`,
            true,
            struct.fields.map((field) =>
                ts.factory.createPropertySignature(
                    undefined,
                    field.name,
                    ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeReferenceNode(findExternalType(field.type, abi))
                )
            )
        ),
    ]

    return {classDeclaration, interfaces}
}
