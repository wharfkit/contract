import {ABI} from '@wharfkit/antelope'
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

export function getCoreImports(abi: ABI.Def) {
    const coreImports: string[] = []
    for (const struct of abi.structs) {
        for (const field of struct.fields) {
            const coreClass = findCoreClass(field.type)

            if (coreClass) {
                coreImports.push(coreClass)
            }

            const isAction = abi.actions.find((action) => action.type === struct.name)

            if (!isAction) {
                continue
            }

            const coreType = findCoreType(field.type)

            if (coreType) {
                coreImports.push(coreType)
            }
        }
    }

    return coreImports.filter((value, index, self) => self.indexOf(value) === index)
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

export function findInternalType(type: string, namespace: string | null, abi: ABI.Def): string {
    let typeString = removeDecorators(type)

    const relevantAbitype = findAbiType(typeString, abi)

    if (relevantAbitype) {
        typeString = relevantAbitype
    }

    const variantType = findVariantType(typeString, namespace, abi)

    if (variantType) {
        typeString = variantType
    }

    return formatInternalType(typeString, namespace, abi)
}

function formatInternalType(typeString: string, namespace: string | null, abi: ABI.Def): string {
    const structNames = abi.structs.map((struct) => struct.name.toLowerCase())

    if (structNames.includes(typeString.toLowerCase())) {
        return `${!!namespace ? `${namespace}.` : ''}${generateStructClassName(typeString)}`
    } else {
        return findCoreClass(typeString) || capitalize(typeString)
    }
}

export function generateStructClassName(name) {
    return name.split('_').map((word) => capitalize(word)).join('')
}

function findVariantType(typeString: string, namespace: string | null, abi: ABI.Def): string | undefined {
    const abiVariant = abi.variants.find(
        (variant) => variant.name.toLowerCase() === typeString.toLowerCase()
    )

    if (!abiVariant) {
        return
    }

    return abiVariant.types
        .map((variant) => formatInternalType(variant, namespace, abi))
        .join(' | ')
}

function findAbiType(typeString: string, abi: ABI.Def): string | undefined {
    return abi.types.find(
        (abiType) => abiType.new_type_name.toLowerCase() === typeString.toLowerCase()
    )?.type
}

export function findExternalType(type: string, abi: ABI.Def): string {
    let typeString = removeDecorators(type)

    const relevantAbitype = findAbiType(typeString, abi)

    if (relevantAbitype) {
        typeString = relevantAbitype
    }

    return findCoreType(typeString) || capitalize(typeString)
}

const decorators = ['?', '[]']
export function removeDecorators(type: string) {
    for (const decorator of decorators) {
        if (type.includes(decorator)) {
            type = type.replace(decorator, '')
            break
        }
    }

    return type
}
