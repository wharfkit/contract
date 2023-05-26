import {ABI} from '@greymass/eosio'
import assert from 'assert'
import * as ts from 'typescript'

interface FieldType {
    name: string
    type: string
}

const file = ts.createSourceFile('codegen.ts', '', 7)
const printer = ts.createPrinter()

function pascalCase(value: string): string {
    return value
        .split(/_| /)
        .map((w) => {
            return w[0].toUpperCase() + w.slice(1).toLowerCase()
        })
        .join('')
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

function createContractClass(abi: ABI, namespaceName: string) {
    const structs: Map<string, ts.ClassDeclaration> = new Map()
    const structTypes: Map<string, ts.TypeAliasDeclaration> = new Map()
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
        const actionStruct = resolved.structs.find((struct) => struct.name === action.name)
        console.log({structs: resolved.structs, actionStruct})
        if (!actionStruct) {
            throw Error(`Action Struct not found for ${action.name}`)
        }
        const actionNameIdentifier = ts.factory.createIdentifier(String(action.name))
        const fields = actionStruct.fields || []
        const actionMethod = ts.factory.createMethodDeclaration(
            undefined, // decorators
            undefined, // asterisk token
            actionNameIdentifier, // name
            undefined, // question token
            undefined, // type parameters
            fields.map((field) => {
                return ts.factory.createParameterDeclaration(
                    undefined, // decorators
                    undefined, // dot dot dot token
                    ts.factory.createIdentifier(field.name), // name
                    undefined, // question token
                    ts.factory.createTypeReferenceNode(cleanupParam(field.type)), // type
                    undefined // initializer
                )
            }) || [],
            ts.factory.createTypeReferenceNode('Promise', [
                ts.factory.createTypeReferenceNode('TransactResult'),
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
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createIdentifier(namespaceName),
                                                ts.factory.createIdentifier('Types')
                                            ),
                                            ts.factory.createIdentifier(capitalize(action.name))
                                        ),
                                        ts.factory.createIdentifier('from')
                                    ),
                                    undefined,
                                    [
                                        ts.factory.createObjectLiteralExpression(
                                            fields.map((field) =>
                                                ts.factory.createPropertyAssignment(
                                                    ts.factory.createIdentifier(field.name),
                                                    ts.factory.createIdentifier(field.name)
                                                )
                                            )
                                        ),
                                    ]
                                ),
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
    const classDeclaration = createClassDeclaration(namespaceName, members, {
        parent: 'Contract',
        export: true,
    })

    // debug print all structs
    for (const struct of structs.values()) {
        printer.printNode(ts.EmitHint.Unspecified, struct, file)
    }
    // debug print all struct types
    for (const structType of structTypes.values()) {
        printer.printNode(ts.EmitHint.Unspecified, structType, file)
    }

    return classDeclaration
}

function createImportStatement(classes, path): ts.ImportDeclaration {
    return ts.factory.createImportDeclaration(
        undefined, // modifiers
        ts.factory.createImportClause(
            false, // isTypeOnly
            undefined, // name
            ts.factory.createNamedImports(
                classes.map((className) =>
                    ts.factory.createImportSpecifier(
                        false,
                        undefined, // propertyName
                        ts.factory.createIdentifier(className) // name
                    )
                )
            ) // namedBindings
        ),
        ts.factory.createStringLiteral(path) // moduleSpecifier
    )
}

function createNamespace(namespaceName: string, children, isExport = true): ts.ModuleDeclaration {
    return ts.factory.createModuleDeclaration(
        isExport ? [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)] : [], // modifiers
        ts.factory.createIdentifier(namespaceName),
        ts.factory.createModuleBlock([...children]),
        ts.NodeFlags.Namespace
    )
}

function createStruct(
    structName: string,
    isExport = false,
    members: ts.ClassElement[] = []
): ts.ClassDeclaration {
    const decorators = [
        ts.factory.createDecorator(
            ts.factory.createCallExpression(ts.factory.createIdentifier('Struct.type'), undefined, [
                ts.factory.createStringLiteral(structName),
            ])
        ),
    ]

    return ts.factory.createClassDeclaration(
        isExport
            ? [...decorators, ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)]
            : decorators,
        ts.factory.createIdentifier(capitalize(structName)),
        undefined, // typeParameters
        [
            ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
                ts.factory.createExpressionWithTypeArguments(
                    ts.factory.createIdentifier('Struct'),
                    []
                ),
            ]),
        ], // heritageClauses
        members // Pass the members array
    )
}

function createField(field: FieldType, isExport = false): ts.PropertyDeclaration {
    const fieldName = field.name.toLowerCase()

    const decorators = [
        ts.factory.createDecorator(
            ts.factory.createCallExpression(
                ts.factory.createIdentifier('Struct.field'),
                undefined,
                [ts.factory.createStringLiteral(fieldName)]
            )
        ),
    ]

    return ts.factory.createPropertyDeclaration(
        isExport
            ? [...decorators, ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)]
            : decorators,
        ts.factory.createIdentifier(fieldName), // Fixed: Use field.name as the identifier
        undefined, // questionToken
        ts.factory.createTypeReferenceNode(capitalize(field.type)), // Fixed: Use field.type as the type reference
        undefined // initializer
    )
}

function getFieldTypesFromAbi(abi: any): {structName: string; fields: FieldType[]}[] {
    const structTypes: {structName: string; fields: FieldType[]}[] = []

    if (abi && abi.structs) {
        for (const struct of abi.structs) {
            const fields: FieldType[] = []

            for (const field of struct.fields) {
                fields.push({
                    name: field.name.charAt(0).toUpperCase() + field.name.slice(1),
                    type: field.type,
                })
            }

            structTypes.push({structName: struct.name, fields})
        }
    }

    return structTypes
}

export async function codegen(contractName, abi) {
    const namespaceName = generateNamespaceName(contractName)

    const importCoreStatement = createImportStatement(
        ['Struct', 'Name', 'NameType', 'Asset', 'AssetType', 'TransactResult'],
        '@wharfkit/session'
    )
    const importContractStatement = createImportStatement(['Contract'], '@wharfkit/contract')

    const classDeclaration = createContractClass(ABI.from(abi), namespaceName)

    // Extract fields from the ABI
    const structs = getFieldTypesFromAbi(abi)

    const structDeclarations: ts.ClassDeclaration[] = []

    // Iterate through structs and create struct with fields
    for (const struct of structs) {
        const structMembers: ts.ClassElement[] = []

        for (const field of struct.fields) {
            structMembers.push(createField(field, true))
        }

        structDeclarations.push(createStruct(struct.structName, true, structMembers))
    }

    // Add your custom namespace and export namespace
    const exportNamespace = createNamespace('Types', structDeclarations)

    const namespace = createNamespace(namespaceName, [exportNamespace])

    const sourceFile = ts.factory.createSourceFile(
        [importContractStatement, importCoreStatement, classDeclaration, namespace],
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
        ts.NodeFlags.None
    )

    return printer.printFile(sourceFile)
}

function capitalize(string) {
    if (typeof string !== 'string' || string.length === 0) {
        return ''
    }

    return string.charAt(0).toUpperCase() + string.slice(1)
}

const EOSIO_CORE_TYPES = ['asset', 'name']

function cleanupParam(type: ABI.ResolvedType) {
    if (EOSIO_CORE_TYPES.includes(type.name)) {
        return `${capitalize(type.name)}Type`
    } else {
        return type.name
    }
}

// Generates a namespace name for a contract (eg. _EosioToken for eosio.token)
function generateNamespaceName(contractName: string) {
    return `_${contractName
        .split('.')
        .map((namePart) => capitalize(namePart))
        .join('')}`
}
