import {assert} from 'chai'

import {Table} from '$lib'

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

    suite('cursor', () => {
        suite('reset', () => {
            test('should allow you to reset the cursor', async () => {
                const tableCursor = mockTable.where({id: {from: 5, to: 6}})

                assert.deepEqual(
                    (await tableCursor.next()).map((row) => row.id),
                    [5, 6]
                )

                assert.deepEqual(
                    (await tableCursor.next()).map((row) => row.id),
                    []
                )

                tableCursor.reset()

                assert.deepEqual(
                    (await tableCursor.next()).map((row) => row.id),
                    [5, 6]
                )
            })
        })
    })

    suite('where', () => {
        suite('all', () => {
            test('should fetch table rows correctly when filtering is used', async () => {
                const tableCursor = mockTable.where({score: {from: 101511, to: 105056}})

                assert.deepEqual(
                    (await tableCursor.all()).map((row) => row.score),
                    [101511, 102465, 102507, 103688, 103734, 105056]
                )
            })

            test('should fetch correct number of table rows when limit option is used', async () => {
                const tableCursor = mockTable.where({id: {from: 5, to: 10}}, {limit: 2})

                assert.deepEqual(
                    (await tableCursor.all()).map((row) => row.id),
                    [5, 6]
                )
            })
        })

        suite('next', () => {
            test('should allow you to fetch more rows after first request', async () => {
                const tableCursor = mockTable.where({id: {from: 5, to: 1000}}, {limit: 10000})
                assert.equal((await tableCursor.next()).length, 235)
                assert.equal((await tableCursor.next()).length, 0)
            })
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

    suite('first', () => {
        suite('next', () => {
            test('should fetch a specific number of table rows correctly', async () => {
                const tableCursor = mockTable.first(10)
                assert.deepEqual(
                    (await tableCursor.next()).map((row) => row.id),
                    [0, 1, 2, 3, 5, 6, 7, 8, 9, 10]
                )
            })
            test('should allow you to fetch more rows after first request', async () => {
                const tableCursor = mockTable.first(250)
                const firstBatch = await tableCursor.next()
                assert.equal(firstBatch.length, 239)
                const secondBatch = await tableCursor.next()
                assert.equal(secondBatch.length, 0)
            })
        })

        suite('all', () => {
            test('should fetch all table rows correctly', async () => {
                const tableCursor = mockTable.first(52)
                const firstBatch = await tableCursor.all()
                assert.equal(firstBatch.length, 52)
            })

            test('should fetch all table rows recursively', async () => {
                const table = new Table({
                    contract: 'eosio',
                    name: 'namebids',
                    client: mockClient,
                })
                const cursor = table.first(10000)
                const allRequestedRows = await cursor.all()
                assert.equal(allRequestedRows.length, 10000)
            })

            test('should stop if requesting more than exists', async () => {
                const tableCursor = mockTable.first(10000)
                const firstBatch = await tableCursor.all()
                assert.equal(firstBatch.length, 239)
            })
        })
    })
})
