import {assert} from 'chai'

import ContractKit, {Contract, Table, TableCursor} from '$lib'

import {Bytes, Int64, Name, Serializer, UInt128} from '@greymass/eosio'
import {makeClient} from '@wharfkit/mock-data'

const mockClient = makeClient('https://eos.greymass.com')

suite('Table', () => {
    let kit: ContractKit
    let eosio: Contract
    let decentiumorg: Contract

    let nameBidTable
    let decentiumTrendingTable
    let producersTable

    setup(async function () {
        kit = new ContractKit({
            client: mockClient,
        })

        eosio = await kit.load('eosio')
        nameBidTable = eosio.table('namebids')
        producersTable = eosio.table('producers')

        decentiumorg = await kit.load('decentiumorg')
        decentiumTrendingTable = decentiumorg.table('trending')
    })

    suite('construct', function () {
        test('defaults', () => {
            const table = new Table({
                contract: eosio,
                name: 'namebids',
            })
            assert.instanceOf(table, Table)
        })
        test('defaults (typed)', () => {
            const table = new Table({
                contract: eosio,
                name: Name.from('namebids'),
            })
            assert.instanceOf(table, Table)
        })
        test('throws immediately on table name not included in contract', () => {
            assert.throws(
                () =>
                    new Table({
                        contract: eosio,
                        name: 'foo',
                    })
            )
        })
        test('fieldToIndex', () => {
            const table = new Table({
                contract: decentiumorg,
                name: Name.from('trending'),
                fieldToIndex: {
                    id: {type: 'uint64', index_position: 'primary'},
                    score: {type: 'uint64', index_position: 'secondary'},
                    cscore: {type: 'uint128', index_position: 'tertiary'},
                    permlink: {type: 'uint128', index_position: 'fourth'},
                },
            })
            assert.instanceOf(table, Table)
        })
    })

    suite('cursor', () => {
        test('should return a cursor', () => {
            const cursor = nameBidTable.cursor()
            assert.instanceOf(cursor, TableCursor)
        })
        suite('all', () => {
            test('should return every single row in a table', async () => {
                const tableCursor = decentiumTrendingTable.cursor()
                assert.equal((await tableCursor.all()).length, 239)
            })
        })
        suite('next', () => {
            test('should allow you to fetch as many rows as possible with one request', async () => {
                const tableCursor = decentiumTrendingTable.cursor()
                assert.equal((await tableCursor.next()).length, 239)
            })

            test('should allow you to fetch more rows after first request', async () => {
                const tableCursor = nameBidTable.cursor()
                assert.equal((await tableCursor.next()).length, 2453)
                assert.equal((await tableCursor.next()).length, 2354)
            })
        })
        suite('reset', () => {
            test('should allow you to reset the cursor', async () => {
                const tableCursor = decentiumTrendingTable.query({from: 5, to: 6})

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
                const tableCursor = decentiumTrendingTable.query(
                    {
                        from: 101511,
                        to: 105056,
                    },
                    {
                        index: 'score',
                    }
                )

                assert.deepEqual(
                    (await tableCursor.all()).map((row) => row.score),
                    [101511, 102465, 102507, 103688, 103734, 105056]
                )
            })

            test('should fetch correct number of table rows when limit option is used', async () => {
                const tableCursor = decentiumTrendingTable.query({from: 5, to: 10}, {limit: 2})

                assert.deepEqual(
                    (await tableCursor.all()).map((row) => row.id),
                    [5, 6]
                )
            })
        })

        suite('next', () => {
            test('should allow you to fetch more rows after first request', async () => {
                const tableCursor = decentiumTrendingTable.query({from: 5}, {limit: 10000})
                assert.equal((await tableCursor.next()).length, 235)
                assert.equal((await tableCursor.next()).length, 0)
            })
        })
    })

    suite('get', () => {
        test('should fetch table row correctly when filtering by primary index is used', async () => {
            const row = await decentiumTrendingTable.get(5, {key_type: 'i64'})

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
        test('should fetch table row correctly when filtering by index', async () => {
            const row = await decentiumTrendingTable.get(102465, {index: 'score'})
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
            const row = await producersTable.get('teamgreymass')

            assert.deepEqual(row, {
                owner: 'teamgreymass',
                total_votes: '10022159900306069504.00000000000000000',
                producer_key: 'EOS5ktvwSdLEdusdRn7NmdV2Xu89xiXjir7EhJuZ4DUa8WMNuojbx',
                is_active: 1,
                url: 'https://greymass.com',
                unpaid_blocks: 0,
                last_claim_time: '2023-07-05T14:59:26.000',
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
                assert.equal(firstBatch.length, 2199)
                const secondBatch = await tableCursor.next()
                assert.equal(secondBatch.length, 2268)
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

    suite('all', () => {
        test('should return every single row in a table', async () => {
            const tableRows = await nameBidTable.all()
            assert.equal(tableRows.length, 53102)
        })
    })
})
