import {assert} from 'chai'
import {Session} from '@wharfkit/session'

import {Contract, Table} from '$lib'
import {makeClient} from '../utils/mock-client'
import {makeMockTransfer} from '../utils/mock-transactions'

const mockClient = makeClient('https://eos.greymass.com')

suite('Contract', () => {
    let mockContract: Contract

    setup(async function () {
        mockContract = new Contract({
            name: 'decentiumorg',
            client: mockClient,
        })
    })

    suite('from', () => {
        test('returns a Contract instance', () => {
            const contract = Contract.from({
                name: 'decentiumorg',
                client: mockClient,
            })
            assert.instanceOf(contract, Contract)
        })
    })

    suite('call', () => {
        test('calls a contract action', async () => {
            let calledWith: any
            const session = {
                transact: async (transactParam) => {
                    calledWith = transactParam
                },
            } // You may need to provide valid session here
            const actionName = 'testAction'
            const data = makeMockTransfer({
                from: 'blockone',
                to: 'teamgreymass',
                quantity: '1.0000 EOS',
                memo: 'gift!',
            })

            const result = await mockContract.call(actionName, data, session as unknown as Session)
        })
    })

    suite('getTables', () => {
        test('returns list of tables', async () => {
            const tables = await mockContract.getTables()
            assert.lengthOf(tables, 5)
            assert.instanceOf(tables[0], Table)
        })
    })

    suite('getTable', () => {
        test('returns single table', async () => {
            assert.instanceOf(await mockContract.getTable('blogs'), Table)
            assert.instanceOf(await mockContract.getTable('links'), Table)
            assert.instanceOf(await mockContract.getTable('posts'), Table)
        })
    })

    suite('getAbi', () => {
        test('returns ABI for the contract', async () => {
            const abi = await mockContract.getAbi()

            // Check that the returned object has a format similar to an ABI.
            // This depends on the structure of your ABI object.
            // Update the assertions accordingly.
            assert.isObject(abi)
            assert.hasAllKeys(abi, [
                'version',
                'types',
                'structs',
                'actions',
                'tables',
                'ricardian_clauses',
                'error_messages',
                'abi_extensions',
                'action_results',
                'variants',
            ])

            // Check that the ABI is correctly cached.
            const abiSecondCall = await mockContract.getAbi()
            assert.strictEqual(
                abi,
                abiSecondCall,
                'ABI should be cached and return the same instance on subsequent calls'
            )
        })

        test('throws error when client is not set', async () => {
            const contractWithoutClient = new Contract({name: 'decentiumorg'})
            try {
                await contractWithoutClient.getAbi()
                assert.fail('Expected method to reject.')
            } catch (err: any) {
                assert.strictEqual(err.message, 'Cannot get ABI without client')
            }
        })

        test('throws error when ABI not found', async () => {
            const contractWithNonExistentName = new Contract({
                name: 'nonExistent',
                client: mockClient,
            })

            try {
                await contractWithNonExistentName.getAbi()
            } catch (error: any) {
                assert.strictEqual(
                    error.message,
                    `No ABI found for ${contractWithNonExistentName.account}`
                )
            }
        })
    })
})
