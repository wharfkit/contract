#!/usr/bin/env node

const fs = require('fs')

const {codegen, fetchAbi} = require('../lib/contract.js')

async function codegenCli() {
    // Check if the contractName argument is provided
    if (process.argv.length < 3) {
        console.error('Usage: wharf-generate {contractName}')
        process.exit(1)
    }

    // Get the contract name from the command line arguments
    const contractName = process.argv[2]

    log(`Fetching ABI for ${contractName}...`)

    const abi = await fetchAbi(contractName)

    if (!abi) {
        log(`No ABI found for ${contractName}`)
    } else {
        log(`Generating Contract helper for ${contractName}...`)

        const generatedCode = await codegen(contractName, abi)

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
}

function log(message) {
    // eslint-disable-next-line no-console
    console.error(message)
}

codegenCli()
