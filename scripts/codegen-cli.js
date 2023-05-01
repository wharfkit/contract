import {codegen} from '../lib/contract.m.js'

// Check if the contractName argument is provided
if (process.argv.length < 3) {
    console.error('Usage: node -r esm scripts/codegen-cli.js {contractName}')
    process.exit(1)
}

// Get the contract name from the command line arguments
const contractName = process.argv[2]

codegen(contractName)
