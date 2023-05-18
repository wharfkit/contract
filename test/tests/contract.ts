import {assert} from 'chai'

import {
    Contract,
    // TableCursor
} from '@wharfkit/contract'
import {makeClient} from '$test/utils/mock-client'

const mockClient = makeClient('https://eos.greymass.com')

suite('getTableRows', () => {
    let mockContract

    setup(async function () {
        mockContract = new Contract({
            account: 'eosio.forum',
            client: mockClient,
        })
    })

    test('should fetch table rows correctly with default options', async () => {
        const tableCursor = await mockContract.getTableRows('proposal')

        // expect(cursor).to.be.instanceOf(TableCursor)
        assert.deepEqual(
            tableCursor.map((row) => row.proposal_name),
            [
                '.......equire',
                '.ccountabilid',
                '.ncrease...of',
                '122',
                '12222',
                '1vs1',
                '1vs11',
                '1vs2',
                '1vs3',
                '1vs4',
            ]
        )
    })

    test('should fetch table rows correctly with start and limit params passed', async () => {
        const tableCursor = await mockContract.getTableRows('proposal', {
            start: '.ncrease...of',
            limit: 1,
        })

        // expect(cursor).to.be.instanceOf(TableCursor)
        assert.deepEqual(
            [...tableCursor],
            [
                {
                    proposal_name: '.ncrease...of',
                    proposer: 'evelyneos111',
                    title: 'Increase number of BP',
                    proposal_json:
                        '{"content":"Increase number of active BPs from 21 to 43.","type":"referendum-v1"}',
                    created_at: '2020-02-20T15:58:34',
                    expires_at: '2020-06-20T00:58:07',
                },
            ]
        )
    })

    test('should fetch table rows correctly with start and end params passed', async () => {
        const tableCursor = await mockContract.getTableRows('proposal', {
            start: '.ncrease...of',
            end: '.ncrease...of',
        })

        // expect(cursor).to.be.instanceOf(TableCursor)
        assert.deepEqual(
            [...tableCursor],
            [
                {
                    proposal_name: '.ncrease...of',
                    proposer: 'evelyneos111',
                    title: 'Increase number of BP',
                    proposal_json:
                        '{"content":"Increase number of active BPs from 21 to 43.","type":"referendum-v1"}',
                    created_at: '2020-02-20T15:58:34',
                    expires_at: '2020-06-20T00:58:07',
                },
            ]
        )
    })

    test('should return a more() function that can be called to get the more rows', async () => {
        let tableCursor = await mockContract.getTableRows('proposal', {
            limit: 2,
        })

        assert.lengthOf(tableCursor, 2)

        tableCursor = await tableCursor.more()

        assert.lengthOf(tableCursor, 4)
        assert.deepEqual(
            tableCursor.map((row) => row.proposal_name),
            ['.......equire', '.ccountabilid', '.ncrease...of', '122']
        )
    })
})
