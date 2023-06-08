import {ABI} from '@greymass/eosio'
import * as ts from 'typescript'

import {generateClassDeclaration} from './helpers'

export function generateTableClass(table, abi) {
    const tableName = table.name

    const struct = abi.structs.find((struct) => struct.name === table.type)

    console.log({struct})

    const members: ts.ClassElement[] = []

    console.log({table})

    // Define fieldToIndex static property
    const fieldToIndex = ts.factory.createPropertyDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
        'fieldToIndex',
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            struct.fields.map((field) =>
                ts.factory.createPropertyAssignment(
                    field.name,
                    ts.factory.createObjectLiteralExpression([
                        ts.factory.createPropertyAssignment(
                            'type',
                            ts.factory.createStringLiteral(field.type)
                        ),
                        ts.factory.createPropertyAssignment(
                            'index_position',
                            ts.factory.createStringLiteral(field.index_position || 'primary')
                        ),
                    ])
                )
            )
        )
    )
    members.push(fieldToIndex)

    // Create 'where', 'find' and 'all' methods
    ;['where', 'find', 'all'].forEach((method) => {
        const parameters = [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier('queryParams'),
                undefined,
                ts.factory.createTypeReferenceNode(`_Blog.types.${tableName}QueryParams`),
                undefined
            ),
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier('client'),
                undefined,
                ts.factory.createTypeReferenceNode('APIClient'),
                undefined
            ),
        ]

        if (method === 'where' || method === 'all') {
            parameters.unshift(
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createObjectBindingPattern([
                        ts.factory.createBindingElement(
                            undefined,
                            undefined,
                            ts.factory.createIdentifier('limit'),
                            ts.factory.createNumericLiteral('10')
                        ),
                    ]),
                    undefined
                )
            )
        }

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
                                                ts.factory.createStringLiteral('blog')
                                            ),
                                            ts.factory.createPropertyAssignment(
                                                'name',
                                                ts.factory.createStringLiteral(
                                                    tableName.toLowerCase()
                                                )
                                            ),
                                            ts.factory.createPropertyAssignment(
                                                'client',
                                                ts.factory.createIdentifier('client')
                                            ),
                                            ts.factory.createPropertyAssignment(
                                                'rowType',
                                                ts.factory.createIdentifier(
                                                    `_Blog.types.${tableName}Row`
                                                )
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
                        [ts.factory.createIdentifier('queryParams')]
                    )
                ),
            ],
            true
        )

        const methodDeclaration = ts.factory.createMethodDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)], // decorators
            undefined, // modifiers
            ts.factory.createIdentifier(method), // name
            undefined,
            undefined, // questionToken
            parameters, // parameters
            ts.factory.createTypeReferenceNode(
                `Promise<${
                    method === 'find'
                        ? `_Blog.types.${tableName}Row`
                        : `TableCursor<_Blog.types.${tableName}Row>`
                }>`
            ), // return type
            methodBody
        )
        members.push(methodDeclaration)
    })

    // Construct class declaration
    const classDeclaration = generateClassDeclaration(tableName, members, {export: true})

    return classDeclaration
}
