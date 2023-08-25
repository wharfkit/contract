import {ABI} from '@wharfkit/session'
import fs from 'fs'
import path from 'path'
import {codegen} from '../../src/codegen'

export async function generateCodegenContract(contractName: string) {
    // Read the ABI from a JSON file
    console.log({contractName, path: `test/data/abis/${contractName}.json` })
    const abiJson = fs.readFileSync(`test/data/abis/${contractName}.json`, {encoding: 'utf8'})
    console.log({abiJson})
    const abi = new ABI(JSON.parse(abiJson))

    // Generate the code
    const generatedCode = await codegen(contractName, abi)

    const testGeneratedCode = generatedCode.replace('@wharfkit/contract', '../../src/index')

    // Create the tmp directory under the test directory if it does not exist
    if (!fs.existsSync('test/tmp')) {
        fs.mkdirSync('test/tmp')
    }

    // Write the generated code to a file in the tmp directory
    fs.writeFileSync(path.join('test/tmp', `${contractName}.ts`), testGeneratedCode, {
        encoding: 'utf8',
    })

    return {
        import: await import(`../tmp/${contractName}`),
        text: generatedCode,
    }
}

export function removeCodegenContracts() {
    fs.rmSync('test/tmp', {recursive: true, force: true})
}
