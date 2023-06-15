import {ABI} from '@greymass/eosio'
import * as ts from 'typescript'

import {capitalize} from '../utils'

export const EOSIO_CORE_CLASSES = [
    'Asset',
    'Checksum256',
    'Float64',
    'Name',
    'TimePoint',
    'TimePointSec',
    'UInt128',
    'UInt16',
    'UInt32',
    'UInt64',
    'UInt8',
]

export const EOSIO_CORE_TYPES = [
    'AssetType',
    'Checksum256Type',
    'Float64Type',
    'NameType',
    'TimePointType',
    'UInt128Type',
    'UInt16Type',
    'UInt32Type',
    'UInt64Type',
    'UInt8Type',
]

interface FieldType {
    name: string
    type: string
}

export function generateClassDeclaration(
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

export function generatePropertyDeclarationForField(name: string, type: ABI.ResolvedType) {
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

export function generateImportStatement(classes, path): ts.ImportDeclaration {
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

export function generateStruct(
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

export function generateField(
    field: FieldType,
    isExport = false,
    namespace: string,
    structNames: string[]
): ts.PropertyDeclaration {
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
        ts.factory.createTypeReferenceNode(findInternalType(field.type, namespace, structNames)), // Fixed: Use field.type as the type reference
        undefined // initializer
    )
}

export function getFieldTypesFromAbi(abi: any): {structName: string; fields: FieldType[]}[] {
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

export function findCoreClass(type: string): string | undefined {
    for (const coreType of EOSIO_CORE_CLASSES) {
        if (type.split('_').join('') === coreType.toLowerCase()) {
            return coreType
        }
    }
}

export function findCoreType(type: string): string | undefined {
    const coreType = findCoreClass(type)

    if (coreType) {
        return `${coreType}Type`
    }
}

export function findInternalType(type: string, namespace: string, structNames: string[]): string {
    const cleanedUpTypeString = removeDecorators(type)

    if (structNames.includes(cleanedUpTypeString.toLowerCase())) {
        return `${namespace}.${capitalize(cleanedUpTypeString)}`
    } else {
        return findCoreClass(cleanedUpTypeString) || capitalize(cleanedUpTypeString)
    }
}

export function findExternalType(type: string): string {
    const cleanedUpTypeString = removeDecorators(type)

    return findCoreType(cleanedUpTypeString) || capitalize(cleanedUpTypeString)
}

const decorators = ['?', '[]']
function removeDecorators(type: string) {
    for (const decorator of decorators) {
        if (type.includes(decorator)) {
            type = type.replace(decorator, '')
            break
        }
    }

    return type
}

interface InterfaceFieldType {
    name: string
    type: ABI.ResolvedType
}

export function generateInterface(
    interfaceName: string,
    isExport = false,
    members: ts.TypeElement[]
): ts.InterfaceDeclaration {
    const modifiers = isExport ? [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)] : []

    return ts.factory.createInterfaceDeclaration(
        modifiers,
        ts.factory.createIdentifier(interfaceName),
        undefined, // typeParameters
        [], // heritageClauses
        members
    )
}
