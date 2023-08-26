import * as Antelope from '@wharfkit/antelope'
import {ABI} from '@wharfkit/antelope'
import * as ts from 'typescript'

import {capitalize} from '../utils'

const ANTELOPE_CLASSES: string[] = []
Object.keys(Antelope).map((key) => {
    if (Antelope[key].abiName) {
        ANTELOPE_CLASSES.push(key)
    }
})

export const ANTELOPE_CLASS_MAPPINGS
 = {
    block_timestamp_type: 'BlockTimestamp'
}

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
    if (ANTELOPE_CLASS_MAPPINGS[type]) {
        return ANTELOPE_CLASS_MAPPINGS[type]
    }

    const parsedType = parseType(type).split('_').join('')

    return ANTELOPE_CLASSES.find((antelopeClass) => parsedType === antelopeClass.toLowerCase()) ||
        ANTELOPE_CLASSES.find((antelopeClass) => parsedType.replace(/[0-9]/g, '') === antelopeClass.toLowerCase())
}

export function findCoreType(type: string): string | undefined {
    const coreType = findCoreClass(type)

    if (coreType) {
        return `${coreType}Type`
    }
}

export function findInternalType(type: string, typeNamespace: string | null, abi: ABI.Def): string {
    let {type: typeString} = extractDecorator(type)

    typeString = parseType(typeString)

    const relevantAbitype = findAbiType(typeString, abi)

    if (relevantAbitype) {
        typeString = relevantAbitype
    }

    return formatInternalType(typeString, typeNamespace, abi)
}

function formatInternalType(typeString: string, namespace: string | null, abi: ABI.Def): string {
    const structNames = abi.structs.map((struct) => struct.name.toLowerCase())

    if (structNames.includes(typeString.toLowerCase())) {
        return `${namespace ? `${namespace}` : ''}${generateStructClassName(typeString)}`
    } else {
        return findCoreClass(typeString) || capitalize(typeString)
    }
}

export function generateStructClassName(name) {
    return name
        .split('_')
        .map((word) => capitalize(word))
        .join('')
}

function findAliasType(typeString: string, abi: ABI.Def): string | undefined {
    const alias = abi.types.find((type) => type.new_type_name === typeString)

    return alias?.type
}

function findVariantType(
    typeString: string,
    namespace: string | null,
    abi: ABI.Def
): string | undefined {
    const abiVariant = abi.variants.find(
        (variant) => variant.name.toLowerCase() === typeString.toLowerCase()
    )

    if (!abiVariant) {
        return
    }

    return abiVariant.types.join(' | ')
}

export function findAbiType(
    type: string,
    abi: ABI.Def,
    typeNamespace = ''
): string | undefined {
    let typeString = type

    const aliasType = findAliasType(typeString, abi)

    if (aliasType) {
        typeString = aliasType
    }

    const variantType = findVariantType(typeString, typeNamespace, abi)

    if (variantType) {
        typeString = variantType
    }

    const abiType = abi.structs.find((abiType) => abiType.name === typeString)?.name

    if (abiType) {
        return `${typeNamespace}${generateStructClassName(abiType)}`
    }
}

export function findExternalType(type: string, abi: ABI.Def, typeNamespace?: string): string {
    let {type: typeString} = extractDecorator(type)
    const {decorator} = extractDecorator(type)

    typeString = parseType(typeString)

    const relevantAbitype = findAbiType(typeString, abi, typeNamespace)
    
    if (relevantAbitype) {
        typeString = relevantAbitype
    }

    return `${findCoreType(typeString) || capitalize(typeString)}${decorator === '[]' ? '[]' : ''}`
}

const decorators = ['?', '[]']
export function extractDecorator(type: string): {type: string; decorator?: string} {
    for (const decorator of decorators) {
        if (type.includes(decorator)) {
            type = type.replace(decorator, '')

            return {type, decorator}
        }
    }

    return {type}
}

function parseType(type: string): string {
    return type.replace('$', '')
}
