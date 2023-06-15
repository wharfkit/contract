import {assert} from 'chai'

import {Table, Contract} from '$lib'

import {makeClient} from '../utils/mock-client'

const mockClient = makeClient('https://eos.greymass.com')

suite('Table', () => {
    let nameBidTable
    let decentiumTrendingTable
    let producersTable

    setup(async function () {
        nameBidTable = new Table({
            contract: Contract.from({name: 'decentiumorg'}),
            name: 'namebids',
            client: mockClient,
        })

        producersTable = new Table({
            contract: 'eosio',
            name: 'producers',
            client: mockClient,
        })

        decentiumTrendingTable = new Table({
            contract: Contract.from({name: 'decentiumorg'}),
            name: 'trending',
            client: mockClient,
        })
    })

    suite('cursor', () => {
        suite('reset', () => {
            test('should allow you to reset the cursor', async () => {
                const tableCursor = decentiumTrendingTable.where({id: {from: 5, to: 6}})

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
                const tableCursor = decentiumTrendingTable.where({
                    score: {from: 101511, to: 105056},
                })

                assert.deepEqual(
                    (await tableCursor.all()).map((row) => row.score),
                    [101511, 102465, 102507, 103688, 103734, 105056]
                )
            })

            test('should fetch correct number of table rows when limit option is used', async () => {
                const tableCursor = decentiumTrendingTable.where(
                    {id: {from: 5, to: 10}},
                    {limit: 2}
                )

                assert.deepEqual(
                    (await tableCursor.all()).map((row) => row.id),
                    [5, 6]
                )
            })
        })

        suite('next', () => {
            test('should allow you to fetch more rows after first request', async () => {
                const tableCursor = decentiumTrendingTable.where({id: {from: 5}}, {limit: 10000})
                assert.equal((await tableCursor.next()).length, 235)
                assert.equal((await tableCursor.next()).length, 0)
            })
        })
    })

    suite('find', () => {
        test('should fetch table row correctly when filtering by primary index is used', async () => {
            const row = await decentiumTrendingTable.find({id: 5})

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
        test('should fetch table row correctly with default filtering', async () => {
            // curl http://eos.greymass.com/v1/chain/get_table_rows -d '{"table":"producers","limit":10,"code":"eosio","scope":"eosio","json":true, "lower_bound": "teamgreymass", "upper_bound": "teamgreymass"}'
            const row = await producersTable.find({owner: 'teamgreymass'})

            assert.deepEqual(row, {
                owner: 'teamgreymass',
                total_votes: '9899236489925054464.00000000000000000',
                producer_key: 'EOS5ktvwSdLEdusdRn7NmdV2Xu89xiXjir7EhJuZ4DUa8WMNuojbx',
                is_active: 1,
                url: 'https://greymass.com',
                unpaid_blocks: 0,
                last_claim_time: '2023-06-23T14:57:10.000',
                location: 124,
                producer_authority: [
                    'block_signing_authority_v0',
                    {
                        threshold: 1,
                        keys: [
                            {
                                key: 'EOS5ktvwSdLEdusdRn7NmdV2Xu89xiXjir7EhJuZ4DUa8WMNuojbx',
                                weight: 1,
                            },
                        ],
                    },
                ],
            })
        })
    })

    suite('first', () => {
        suite('next', () => {
            test('should fetch a specific number of table rows correctly', async () => {
                const tableCursor = decentiumTrendingTable.first(10)
                assert.deepEqual(
                    (await tableCursor.next()).map((row) => row.id),
                    [0, 1, 2, 3, 5, 6, 7, 8, 9, 10]
                )
            })
            test('should allow you to fetch more rows after first request', async () => {
                const tableCursor = nameBidTable.first(100000)
                const firstBatch = await tableCursor.next()
                assert.equal(firstBatch.length, 3975)
                const secondBatch = await tableCursor.next()
                assert.equal(secondBatch.length, 3542)
            })
        })

        suite('all', () => {
            test('should fetch all table rows recursively', async () => {
                const cursor = nameBidTable.first(10000)
                const allRequestedRows = await cursor.all()
                assert.equal(allRequestedRows.length, 10000)
            })

            test('should stop if requesting more than exists', async () => {
                const tableCursor = decentiumTrendingTable.first(10000)
                const firstBatch = await tableCursor.all()
                assert.equal(firstBatch.length, 239)
            })
        })
    })

    suite('cursor', () => {
        suite('all', () => {
            test('should return every single row in a table', async () => {
                const tableCursor = decentiumTrendingTable.cursor()
                assert.equal((await tableCursor.all()).length, 239)
            })
        })

        test('next', async () => {
            test('should allow you to fetch as many rows as possible with one request', async () => {
                const tableCursor = decentiumTrendingTable.cursor()
                assert.equal((await tableCursor.next()).length, 239)
            })

            test('should allow you to fetch more rows after first request', async () => {
                const tableCursor = nameBidTable.cursor()
                assert.equal((await tableCursor.next()).length, 3718)
                assert.equal((await tableCursor.next()).length, 3766)
            })
        })
    })

    suite('all', () => {
        test('should return every single row in a table', async () => {
            const tableRows = await nameBidTable.all()
            assert.equal(tableRows.length, 53107)
        })
    })
})
