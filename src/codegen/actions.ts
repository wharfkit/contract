import {ABI} from '@greymass/eosio'
import assert from 'assert'
import * as ts from 'typescript'

import {
    findExternalType,
    generateClassDeclaration,
    generateInterface,
    generatePropertyDeclarationForField,
} from './helpers'
import {capitalize, pascalCase} from '../utils'

export function generateActions(contractName: string, namespaceName: string, abi: ABI) {
    const structs: Map<string, ts.ClassDeclaration> = new Map()
    const coreImports: Set<string> = new Set()

    const resolved = abi.resolveAll()

    function getTypeIdentifier(type: ABI.ResolvedType) {
        if (type.fields) {
            return getStructDeclaration(type).name!
        }
        return ts.factory.createIdentifier(type.name)
    }

    function getStructDeclaration(type: ABI.ResolvedType) {
        const name = pascalCase(type.name)
        assert(type.fields, 'struct type must have fields')
        if (structs.has(name)) {
            return structs.get(name)!
        }
        let parentClass: ts.Identifier
        if (type.base) {
            parentClass = getTypeIdentifier(type.base)
        } else {
            coreImports.add('Struct')
            parentClass = ts.factory.createIdentifier('Struct')
        }

        const members = type.fields!.map((field) => {
            return generatePropertyDeclarationForField(field.name, field.type)
        })
        const structDecorator = ts.factory.createDecorator(
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier('Struct'),
                    ts.factory.createIdentifier('type')
                ),
                undefined, // type arguments
                [ts.factory.createStringLiteral(type.name)]
            )
        )
        const structClass = generateClassDeclaration(name, members, {
            export: true,
            parent: parentClass.text,
            decorator: structDecorator,
        })
        structs.set(name, structClass)
        return structClass
    }

    for (let abiType of resolved.structs) {
        while (abiType.ref) {
            abiType = abiType.ref
        }
        const members = abiType.allFields!.map((field) => {
            return generatePropertyDeclarationForField(field.name, field.type)
        })
        const structDecorator = ts.factory.createDecorator(
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier('Struct'),
                    ts.factory.createIdentifier('type')
                ),
                undefined, // type arguments
                [ts.factory.createStringLiteral(abiType.name)]
            )
        )
        const structClass = generateClassDeclaration(abiType.name, members, {
            export: true,
            decorator: structDecorator,
        })
        structs.set(abiType.name, structClass)
    }

    const members: ts.FunctionDeclaration[] = []
    const interfaces: ts.InterfaceDeclaration[] = []

    // add a method for each action
    for (const action of abi.actions) {
        const actionStruct = resolved.structs.find((struct) =>
            struct.name.includes(String(action.name))
        )
        if (!actionStruct) {
            throw Error(`Action Struct not found for ${action.name}`)
        }
        const actionName = String(action.name)
        const actionNameIdentifier = ts.factory.createIdentifier(actionName)
        const fields = actionStruct.fields || []

        const interfaceMembers = fields.map((field) =>
            ts.factory.createPropertySignature(
                undefined,
                field.name,
                undefined,
                ts.factory.createTypeReferenceNode(findExternalType(field.type.name, abi))
            )
        )

        interfaces.push(
            generateInterface(`${capitalize(actionName)}Params`, true, interfaceMembers)
        )

        const actionMethod = ts.factory.createFunctionDeclaration(
            undefined,
            [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            undefined,
            actionNameIdentifier, // name
            undefined, // question token
            [
                ts.factory.createParameterDeclaration(
                    undefined, // decorators
                    undefined, // dot dot dot token
                    ts.factory.createIdentifier(`${actionName}Params`), // name
                    undefined, // question token
                    ts.factory.createTypeReferenceNode(
                        `${namespaceName}.types.${capitalize(actionName)}Params`
                    ), // type
                    undefined // initializer
                ),
                ts.factory.createParameterDeclaration(
                    undefined, // decorators
                    undefined, // dot dot dot token
                    ts.factory.createIdentifier('session'), // name
                    undefined, // question token
                    ts.factory.createTypeReferenceNode('Session'), // type
                    undefined // initializer
                ),
            ],
            ts.factory.createTypeReferenceNode('Promise', [
                ts.factory.createTypeReferenceNode('TransactResult'),
            ]), // type
            ts.factory.createBlock(
                [
                    ts.factory.createVariableStatement(
                        undefined,
                        ts.factory.createVariableDeclarationList(
                            [
                                ts.factory.createVariableDeclaration(
                                    'contract',
                                    undefined,
                                    undefined,
                                    ts.factory.createCallExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createIdentifier('Contract'),
                                            ts.factory.createIdentifier('from')
                                        ),
                                        undefined,
                                        [
                                            ts.factory.createObjectLiteralExpression(
                                                [
                                                    ts.factory.createPropertyAssignment(
                                                        'name',
                                                        ts.factory.createStringLiteral(contractName)
                                                    ),
                                                ],
                                                false
                                            ),
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
                                ts.factory.createIdentifier('contract'),
                                ts.factory.createIdentifier('call')
                            ),
                            undefined,
                            [
                                ts.factory.createStringLiteral(String(action.name)),
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createIdentifier(namespaceName),
                                                ts.factory.createIdentifier('types')
                                            ),
                                            ts.factory.createIdentifier(
                                                capitalize(actionStruct?.name)
                                            )
                                        ),
                                        ts.factory.createIdentifier('from')
                                    ),
                                    undefined,
                                    [ts.factory.createIdentifier(`${actionName}Params`)]
                                ),
                                ts.factory.createIdentifier('session'),
                            ]
                        )
                    ),
                ],
                true
            )
        )
        members.push(actionMethod)
    }

    return {methods: members, interfaces}
}
