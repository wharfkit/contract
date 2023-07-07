import {assert} from 'chai'
import {makeClient, makeMockAction, mockSession} from '@wharfkit/mock-data'

import ContractKit, {Contract, ContractArgs, Table} from '$lib'
import {ABI, Name, Serializer} from '@wharfkit/session'

const mockClient = makeClient('https://eos.greymass.com')

const mockContractArgs: ContractArgs = {
    abi: {version: 'eosio::abi/1.2'},
    account: 'eosio',
    client: mockClient,
}

suite('Contract', () => {
    let mockContract: Contract

    setup(async function () {
        const kit = new ContractKit({
            client: mockClient,
        })
        mockContract = await kit.load('eosio')
    })

    suite('construct', function () {
        test('typed', function () {
            const contract = new Contract({
                ...mockContractArgs,
                abi: ABI.from(mockContractArgs.abi),
                account: Name.from(mockContractArgs.account),
            })
            assert.instanceOf(contract, Contract)
        })
        test('untyped', function () {
            const contract = new Contract(mockContractArgs)
            assert.instanceOf(contract, Contract)
        })
    })

    suite('tables', function () {
        test('list table names', function () {
            assert.isArray(mockContract.tables)
            assert.lengthOf(mockContract.tables, 26)
            assert.isTrue(mockContract.tables.includes('voters'))
        })
    })

    suite('table', function () {
        test('load table using Name', function () {
            const table = mockContract.table('voters')
            assert.instanceOf(table, Table)
            assert.isTrue(table.name.equals('voters'))
        })
        test('load table using string', function () {
            const table = mockContract.table(Name.from('voters'))
            assert.instanceOf(table, Table)
            assert.isTrue(table.name.equals('voters'))
        })
        test('throws on invalid name', function () {
            assert.throws(() => mockContract.table('foo'))
        })
    })

    // TODO: reimplement call tests
    // suite('call', () => {
    //     test('calls a contract action', async () => {
    //         const contract = new Contract({
    //             name: 'eosio.token',
    //             client: mockClient,
    //         })
    //         const session = mockSession
    //         const actionName = 'transfer'
    //         const {data} = makeMockAction()
    //         await contract.call(actionName, data, session)
    //     })
    // })
})
