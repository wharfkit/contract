import * as ts from 'typescript'
import { ABI, Serializer } from '@wharfkit/session'
import { generateClassDeclaration } from './helpers'

export async function generateContractClass(namespaceName: string, contractName: string, abi: ABI) {
    // Encode the ABI as a binary hex string
    const abiHex = Serializer.encode({ object: abi }).hexString

    // Prepare the member fields of the class
    const classMembers: ts.ClassElement[] = []

    // Generate the private `abi` member
    const abiField = ts.factory.createPropertyDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
        'abi',
        undefined,
        undefined,
        ts.factory.createStringLiteral(abiHex)
    )
    classMembers.push(abiField)

    // Generate the `constructor` member
    const constructorParams: ts.ParameterDeclaration[] = [
        ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            'args',
            undefined,
            ts.factory.createTypeReferenceNode('ContractArgs', undefined),
            undefined
        )
    ]

    const constructorBody = ts.factory.createBlock([
        ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createSuper(), undefined, [])),
        ts.factory.createExpressionStatement(ts.factory.createAssignment(
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'abi'),
            ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('ABI'), 'from'), undefined, [ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'abi')]))),
        ts.factory.createExpressionStatement(ts.factory.createAssignment(
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'account'),
            ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('Name'), 'from'), undefined, [ts.factory.createStringLiteral(contractName)]))),
        ts.factory.createExpressionStatement(ts.factory.createAssignment(
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'client'),
            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('args'), 'client')))
    ], true)

    const constructorMember = ts.factory.createConstructorDeclaration(
        undefined,
        undefined,
        constructorParams,
        constructorBody
    )

    classMembers.push(constructorMember)

    // Construct class declaration
    const classDeclaration = generateClassDeclaration(namespaceName, classMembers, {parent: 'Contract', export: true})

    return { classDeclaration }
}
