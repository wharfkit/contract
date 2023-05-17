import {assert} from 'chai'

import {
    Contract,
    // TableCursor
} from '@wharfkit/contract'
import {makeClient} from '$test/utils/mock-client'

const mockClient = makeClient('https://jungle4.greymass.com')

suite('getTableRows', () => {
    let mockContract

    setup(async function () {
        mockContract = new Contract({
            account: 'eosio.forums',
            client: mockClient,
        })
    })

    test('should fetch table rows correctly with default options', async () => {
        const cursor = await mockContract.getTableRows('customTable', {
            scope: 'customScope',
            json: false,
            start: '10',
            end: '20',
            limit: 50,
            index: 2,
            indexType: 'i64',
        })

        // expect(cursor).to.be.instanceOf(TableCursor)
        assert.deepEqual(
            [...cursor],
            [
                {id: 1, title: 'Proposal 1', content: 'Proposal 1 content'},
                // ... more mock rows
            ]
        )
    })
})
