import {assert} from 'chai'
import {makeClient, makeMockAction, mockSession} from '@wharfkit/mock-data'

import {Contract, Table} from '$lib'

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
            const contract = new Contract({
                name: 'eosio.token',
                client: mockClient,
            })
            const session = mockSession
            const actionName = 'transfer'
            const {data} = makeMockAction()
            await contract.call(actionName, data, session)
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
