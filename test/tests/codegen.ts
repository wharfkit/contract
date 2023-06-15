import * as fs from 'fs'
import {assert} from 'chai'
import {codegen} from '$lib' // replace with your actual codegen file
import {ABI} from '@greymass/eosio'

suite('Codegen Function', function () {
    test('should match the content of the file', async function () {
        const contractName = 'yourContractName' // replace with your contract name

        // Read the ABI from a JSON file
        const abiJson = fs.readFileSync('test/data/abis/rewards.gm.json', {encoding: 'utf8'})
        const abi = new ABI(JSON.parse(abiJson))

        // Generate the code
        const generatedCode = await codegen(contractName, abi)

        // Read the content of the file
        const fileContent = fs.readFileSync('test/codegen-samples/rewards.gm.ts', {
            encoding: 'utf8',
        })

        // Compare the generated code with the content of the file
        assert.equal(generatedCode, fileContent)
    })
})
