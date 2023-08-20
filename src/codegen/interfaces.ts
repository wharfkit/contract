import {ABI} from '@wharfkit/session'
import ts from 'typescript'
import {capitalize} from '../utils'
import {findExternalType} from './helpers'
import {getActionFieldFromAbi} from './structs'

export function generateActionNamesInterface(abi: ABI.Def): ts.InterfaceDeclaration {
    // Generate property signatures for each action
    const members = abi.actions.map((action) => {
        const actionName = String(action.name)
        const actionNameCapitalized = capitalize(actionName)

        return ts.factory.createPropertySignature(
            undefined,
            actionName,
            undefined,
            ts.factory.createTypeReferenceNode(`ActionParams.${actionNameCapitalized}`)
        )
    })

    return ts.factory.createInterfaceDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        'ActionNameParams',
        undefined,
        undefined,
        members
    )
}

export function generateActionInterface(actionStruct, abi): ts.InterfaceDeclaration {
    const members = actionStruct.fields.map((field) => {
        return ts.factory.createPropertySignature(
            undefined,
            field.name.toLowerCase(),
            field.type.includes('?')
                ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
                : undefined,
            ts.factory.createTypeReferenceNode(
                findExternalType(field.type, abi, 'Types.'),
                undefined
            )
        )
    })

    return ts.factory.createInterfaceDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        capitalize(actionStruct.structName),
        undefined,
        undefined,
        members
    )
}

export function generateActionsNamespace(abi: ABI.Def): ts.ModuleDeclaration {
    const actionStructsWithFields = getActionFieldFromAbi(abi)

    const interfaces = abi.actions.map((action) => {
        const actionStruct = actionStructsWithFields.find(
            (actionStructWithField) => actionStructWithField.structName === action.type
        )
        return generateActionInterface(actionStruct, abi)
    })

    return ts.factory.createModuleDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ActionParams'),
        ts.factory.createModuleBlock(interfaces),
        ts.NodeFlags.Namespace
    )
}
