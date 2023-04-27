import {ABI} from '@greymass/eosio'
import assert from 'assert'
import * as ts from 'typescript'

import {eosioTokenModified} from './sample-abis'

const file = ts.createSourceFile('test.ts', '', ts.ScriptTarget.ES2022)
const printer = ts.createPrinter()

function pascalCase(value: string): string {
    return value
        .split(/_| /)
        .map((w) => {
            return w[0].toUpperCase() + w.slice(1).toLowerCase()
        })
        .join('')
}

function camelCase(value: string): string {
    const rv = pascalCase(value)
    return rv[0].toLowerCase() + rv.slice(1)
}

function createClassDeclaration(
    name: string,
    members: ts.ClassElement[],
    options: {parent?: string; export?: boolean; decorator?: ts.Decorator} = {}
) {
    const heritageClauses: ts.HeritageClause[] = []
    if (options.parent) {
        heritageClauses.push(
            ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
                ts.factory.createExpressionWithTypeArguments(
                    ts.factory.createIdentifier(options.parent),
                    undefined
                ),
            ])
        )
    }
    const modifiers: ts.ModifierLike[] = []
    if (options.export === true) {
        modifiers.push(ts.factory.createToken(ts.SyntaxKind.ExportKeyword))
    }
    if (options.decorator) {
        modifiers.push(options.decorator)
    }
    const classDeclaration = ts.factory.createClassDeclaration(
        modifiers,
        ts.factory.createIdentifier(name),
        undefined, // type parameters
        heritageClauses,
        members
    )
    return classDeclaration
}

function createTypeDeclarationForType(type: ABI.ResolvedType) {}

function createPropertyDeclarationForField(name: string, type: ABI.ResolvedType) {
    // field options is an object with all optional fields, e.g.: {array: true, optional: true, extension: true}
    const optionsProps: ts.ObjectLiteralElementLike[] = []
    if (type.isArray) {
        optionsProps.push(
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('array'),
                ts.factory.createTrue()
            )
        )
    }
    if (type.isOptional) {
        optionsProps.push(
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('optional'),
                ts.factory.createTrue()
            )
        )
    }
    if (type.isExtension) {
        optionsProps.push(
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('extension'),
                ts.factory.createTrue()
            )
        )
    }
    let optionsObject: ts.ObjectLiteralExpression | undefined
    if (optionsProps.length > 0) {
        optionsObject = ts.factory.createObjectLiteralExpression(optionsProps)
    }
    // decorator is a function call, e.g.: @Struct.field(fieldTypeStringorClass, options)
    const decoratorArguments: ts.Expression[] = [ts.factory.createStringLiteral(type.name)]
    if (optionsObject) {
        decoratorArguments.push(optionsObject)
    }
    const fieldDecorator = ts.factory.createDecorator(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier('Struct'),
                ts.factory.createIdentifier('field')
            ),
            undefined, // type arguments
            decoratorArguments
        )
    )
    // modifier token: declare
    const declareModifier = ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)

    const propertyDeclaration = ts.factory.createPropertyDeclaration(
        [fieldDecorator, declareModifier], // decorators
        ts.factory.createIdentifier(name), // name
        undefined, // question token
        ts.factory.createTypeReferenceNode(type.name), // type
        undefined // initializer
    )
    return propertyDeclaration
}

function createContractClass(abi: ABI, name = 'contractImpl') {
    const structs: Map<string, ts.ClassDeclaration> = new Map()
    const structTypes: Map<string, ts.TypeAliasDeclaration> = new Map()
    const coreImports: Set<string> = new Set()

    const resolved = abi.resolveAll()

    function getTypeIdentifier(type: ABI.ResolvedType) {
        if (type.fields) {
            return getStructDeclaration(type).name!
        }
        return ts.factory.createIdentifier(type.name)
        throw new Error(`unhandled type: ${type.name}`)
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
            return createPropertyDeclarationForField(field.name, field.type)
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
        const structClass = createClassDeclaration(name, members, {
            export: true,
            parent: parentClass.text,
            decorator: structDecorator,
        })
        structs.set(name, structClass)
        return structClass
    }

    function getStructType(type: ABI.ResolvedType) {
        // get the type interface for the struct that can be used in the .from() classmethod
        // e.g. type MyStructType = MyStruct | {field1: string, field2: number}
        const looseInterface = ts.factory.createTypeLiteralNode(
            type.allFields!.map((field) => {
                return ts.factory.createPropertySignature(
                    undefined, // modifiers
                    field.name, // name
                    field.type.isOptional
                        ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
                        : undefined, // question token
                    ts.factory.createTypeReferenceNode(getTypeIdentifier(field.type)) // type
                )
            })
        )
        const structDeclaration = getStructDeclaration(type)
        // type MyStructType = MyStruct | {field1: string, field2: number}
        const structType = ts.factory.createUnionTypeNode([
            ts.factory.createTypeReferenceNode(structDeclaration.name!),
            looseInterface,
        ])
        const alias = ts.factory.createTypeAliasDeclaration(
            undefined, // decorators
            [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)], // modifiers
            `${type.name}Type`, // name
            undefined, // type parameters
            structType // type
        )
        structTypes.set(type.name, alias)
        return alias.name
    }

    for (let abiType of resolved.structs) {
        while (abiType.ref) {
            abiType = abiType.ref
        }
        const members = abiType.allFields!.map((field) => {
            return createPropertyDeclarationForField(field.name, field.type)
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
        const structClass = createClassDeclaration(abiType.name, members, {
            export: true,
            decorator: structDecorator,
        })
        structs.set(abiType.name, structClass)
    }

    const members: ts.ClassElement[] = []
    // add a method for each action
    for (const action of abi.actions) {
        console.log('create', action.name)
        const actionName = ts.factory.createIdentifier(String(action.name))
        const actionMethod = ts.factory.createMethodDeclaration(
            undefined, // decorators
            undefined, // asterisk token
            actionName, // name
            undefined, // question token
            undefined, // type parameters
            [
                ts.factory.createParameterDeclaration(
                    undefined, // decorators
                    undefined, // dot dot dot token
                    ts.factory.createIdentifier('args'), // name
                    undefined, // question token
                    ts.factory.createTypeReferenceNode(getStructType(abi.resolveType(action.type))), // , // type
                    undefined // initializer
                ),
            ], // parameters
            ts.factory.createTypeReferenceNode('Promise', [
                ts.factory.createTypeReferenceNode('void'),
            ]), // type
            ts.factory.createBlock(
                [
                    ts.factory.createReturnStatement(
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createThis(),
                                ts.factory.createIdentifier('call')
                            ),
                            undefined,
                            [
                                ts.factory.createStringLiteral(String(action.name)),
                                ts.factory.createIdentifier('args'),
                            ]
                        )
                    ),
                ],
                true
            )
        )
        members.push(actionMethod)
    }
    // build out contract class with actions
    const classDeclaration = createClassDeclaration(name, members, {
        parent: 'Contract',
        export: true,
    })

    // debug print all structs
    for (const struct of structs.values()) {
        const result = printer.printNode(ts.EmitHint.Unspecified, struct, file)
        console.log(result)
    }
    // debug print all struct types
    for (const structType of structTypes.values()) {
        const result = printer.printNode(ts.EmitHint.Unspecified, structType, file)
        console.log(result)
    }

    return classDeclaration
}

const contractClass = createContractClass(eosioTokenModified)
const result2 = printer.printNode(ts.EmitHint.Unspecified, contractClass, file)
console.log(result2)
