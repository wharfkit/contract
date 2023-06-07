import {assert} from 'chai'

import {
    Contract,
    // TableCursor
} from '@wharfkit/contract'
import {makeClient} from '$test/utils/mock-client'

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
})
