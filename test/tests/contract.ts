import {assert} from 'chai'

import {Contract, Table} from '$lib'
import {makeClient} from '../utils/mock-client'

const mockClient = makeClient('https://eos.greymass.com')

suite('Contract', () => {
    let mockContract

    setup(async function () {
        mockContract = new Contract({
            name: 'decentiumorg',
            client: mockClient,
        })
    })

    suite('shared', () => {})

    suite('call', () => {})

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
})
