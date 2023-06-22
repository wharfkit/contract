import * as fs from 'fs'
import * as path from 'path'

import {assert} from 'chai'
import {ABI} from '@greymass/eosio'

import {codegen} from '$lib' // replace with your actual codegen file

import {Session, APIClient, TransactResult} from '@wharfkit/session'
import {makeClient} from '../utils/mock-client'

let _RewardsGm

suite('codegen', function () {
    setup(async () => {
        const contractName = 'rewards.gm' // replace with your contract name

        // Read the ABI from a JSON file
        const abiJson = fs.readFileSync(`test/data/abis/${contractName}.json`, {encoding: 'utf8'})
        const abi = new ABI(JSON.parse(abiJson))

        // Generate the code
        let generatedCode = await codegen(contractName, abi)

        generatedCode = generatedCode.replace('@wharfkit/contract', '../../src/index')

        // Create the tmp directory under the test directory if it does not exist
        if (!fs.existsSync('test/tmp')) {
            fs.mkdirSync('test/tmp')
        }

        // Write the generated code to a file in the tmp directory
        fs.writeFileSync(path.join('test/tmp', `${contractName}.ts`), generatedCode, {
            encoding: 'utf8',
        })

        const contractPackage = await import(`../tmp/${contractName}`)

        _RewardsGm = contractPackage._RewardsGm
    })

    teardown(() => {
        // Remove the 'test/tmp' directory and its contents after each run
        fs.rmSync('test/tmp', {recursive: true, force: true})
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

        suite('where', function () {
            test('returns a cursor that lets you filter rows', async function () {
                const rows = await _RewardsGm.tables.users
                    .where({account: {from: 'dafuga.gm', to: 'tony.gm'}}, client)
                    .all()

                assert.equal(rows.length, 1)
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

                assert.equal(rows.length, 9)
            })
        })

        suite('cursor', function () {
            test('returns a cursor that allows you to fetch all rows', async function () {
                const rows = await _RewardsGm.tables.users.cursor().all()

                assert.equal(rows.length, 9)
            })
        })

        suite('all', function () {
            test('returns all rows', async function () {
                const rows = await _RewardsGm.tables.users.all(client)

                assert.equal(rows.length, 10)
            })
        })
    })
})
