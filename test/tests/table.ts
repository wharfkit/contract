import {assert} from 'chai'

import {Table, TableCursor} from '$lib'

import {makeClient} from '../utils/mock-client'

const mockClient = makeClient('https://eos.greymass.com')

suite('Table', () => {
    let mockTable

    setup(async function () {
        mockTable = new Table({
            contract: 'decentiumorg',
            name: 'trending',
            client: mockClient,
        })
    })

    suite('where', () => {
        test('should fetch table rows correctly when filtering is used', async () => {
            const tableCursor = await mockTable.where({score: {from: 101511, to: 105056}})

            assert.deepEqual(
                tableCursor.map((row) => row.score),
                [101511, 102465, 102507, 103688, 103734, 105056]
            )
        })

        test('should fetch correct number of table rows when limit option is used', async () => {
            const tableCursor = await mockTable.where({id: {from: 5, to: 10}}, {limit: 2})

            assert.deepEqual(
                tableCursor.map((row) => row.id),
                [5, 6]
            )
        })

        test('should return a table cursor instance which allows you to get more rows', async () => {
            const tableCursor = await mockTable.where({id: {from: 5, to: 7}}, {limit: 2})

            assert.deepEqual(
                tableCursor.map((row) => row.id),
                [5, 6]
            )

            await tableCursor.more()

            assert.deepEqual(
                tableCursor.map((row) => row.id),
                [5, 6, 7]
            )
        })
    })

    suite('find', () => {
        test('should fetch table row correctly when filtering by primary index is used', async () => {
            const row = await mockTable.find({id: 5})

            assert.deepEqual(row, {
                id: 5,
                score: 102465,
                ref: {
                    permlink: {
                        author: 'eosfilestore',
                        slug: 'eosfilestore',
                    },
                    timestamp: '2019-05-27T19:58:53',
                    category: 'decentium',
                    options: 3,
                    tx: {
                        block_num: 60399260,
                        transaction_id:
                            'de1a09302017b9bbe1ba8aec85617dd6513aaf4bc65e5e1e3663be34cd9cfaac',
                    },
                    edit_tx: null,
                    endorsements: {
                        amount: 0,
                        count: 0,
                    },
                    extensions: [],
                },
                extensions: [],
            })
        })
    })

    suite('all', () => {
        test('should fetch all table rows correctly', async () => {
            const tableCursor = await mockTable.all()

            assert.deepEqual(
                tableCursor.map((row) => row.id),
                [0, 1, 2, 3, 5, 6, 7, 8, 9, 10]
            )
        })

        test('should fetch correct number of table rows when limit option is used', async () => {
            const tableCursor = await mockTable.all({limit: 2})

            assert.deepEqual(
                tableCursor.map((row) => row.id),
                [0, 1]
            )
        })

        test('should return a table cursor instance which allows you to get more rows', async () => {
            const tableCursor = await mockTable.all({limit: 2})

            assert.deepEqual(
                tableCursor.map((row) => row.id),
                [0, 1]
            )

            await tableCursor.more()

            assert.deepEqual(
                tableCursor.map((row) => row.id),
                [0, 1, 2, 3]
            )
        })
    })
})
