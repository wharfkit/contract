import * as fs from 'fs'
import {assert} from 'chai'
import {ABI} from '@greymass/eosio'

import {codegen} from '$lib' // replace with your actual codegen file

import {_RewardsGm} from '../codegen-samples/rewards.gm' // replace with your actual file import
import {Session, APIClient, TransactResult} from '@wharfkit/session'
import {makeClient} from '../utils/mock-client'

suite('codegen', function () {
    suite('generator', function () {
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

    suite('_RewardsGm', function () {
        let client: APIClient

        // Setup before each test
        setup(function () {
            // Initialize contract, session, client
            // This is just an example, you may need to use real or mocked values depending on your test setup
            client = makeClient('https://eos.greymass.com')
        })

        suite('adduser', function () {
            test('adduser calls the correct contract action', async function () {
                let calledWith: any
                const session = {
                    transact: async (transactParam) => {
                        calledWith = transactParam
                    },
                }

                await _RewardsGm.actions.adduser(
                    {
                        account: 'teamgreymass',
                        weight: 100,
                    },
                    session as unknown as Session
                )

                assert.equal(calledWith, {})
            })
        })

        suite('find', function () {
            test('returns a single row', async function () {
                const row = await _RewardsGm.tables.users.find({account: 'dafuga.gm'}, client)

                assert.equal(String(row.account), 'dafuga.gm')
            })
        })

        suite('first', function () {
            test('returns a cursor that lets you fetch the first n rows', async function () {
                const rows = await _RewardsGm.tables.users.first(10, client).all()

                assert.equal(rows.length, 10)
            })
        })
    })
})
