#!/usr/bin/env node

const {APIClient} = require('@wharfkit/session')
const fs = require('fs')
const {fetch} = require('node-fetch')

const {codegen, ContractKit} = require('../lib/contract.js')

const client = new APIClient({
    url: process.env.ANTELOPE_NODE_URL || 'https://eos.greymass.com',
    fetch,
})

async function codegenCli() {
    // Check if the contractName argument is provided
    if (process.argv.length < 3) {
        console.error('Usage: wharf-generate {contractName}')
        process.exit(1)
    }

    // Get the contract name from the command line arguments
    const contractName = process.argv[2]

    log(`Fetching ABI for ${contractName}...`)

    const contractKit = new ContractKit({
        client,
    })
    const contract = await contractKit.load(contractName)

    log(`Generating Contract helper for ${contractName}...`)

    const generatedCode = await codegen(contractName, contract.abi)

    log(`Generated Contract helper class for ${contractName}...`)

    // Check if --file is present in the command line arguments
    const fileFlagIndex = process.argv.indexOf('--file')
    if (fileFlagIndex !== -1 && process.argv[fileFlagIndex + 1]) {
        const contractFilePath = process.argv[fileFlagIndex + 1]

        fs.writeFileSync(contractFilePath, generatedCode)

        log(`Generated Contract helper for ${contractName} saved to ${contractFilePath}`)
    } else {
        log(`Generated Contract helper class:`)
        log(generatedCode)
    }
}

function log(message) {
    process.stderr.write(`${message}\n`)
}

codegenCli()
