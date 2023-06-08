import {assert} from 'chai'

import {Contract, Table} from '$lib'
import {makeClient} from '../utils/mock-client'

const mockClient = makeClient('https://eos.greymass.com')

suite('Contract', () => {
    let mockContract

    setup(async function () {
        mockContract = new Contract({
            account: 'eosio.forum',
            client: mockClient,
        })
    })

    suite('shared', () => {})

    suite('call', () => {})

    suite('tables', () => {
        test('has tables', () => {
            assert.lengthOf(mockContract.tables, 3)
            assert.instanceOf(mockContract.tables.proposal, Table)
            assert.instanceOf(mockContract.tables.status, Table)
            assert.instanceOf(mockContract.tables.vote, Table)
        })
    })
})
