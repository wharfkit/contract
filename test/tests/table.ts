import {assert} from 'chai'

import ContractKit, {Contract, Table, TableRowCursor} from '$lib'

import {Asset, Int64, Name, Serializer, Struct, TimePoint} from '@wharfkit/antelope'
import {makeClient} from '@wharfkit/mock-data'
import {EosioGlobalState} from '$test/data/structs/eosio'

const mockClient = makeClient('https://eos.greymass.com')

suite('Table', () => {
    let kit: ContractKit
    let eosio: Contract
    let msig: Contract
    let decentiumorg: Contract

    let nameBidTable
    let decentiumTrendingTable
    let producersTable

    setup(async function () {
        kit = new ContractKit({
            client: mockClient,
        })

        eosio = await kit.load('eosio')
        msig = await kit.load('eosio.msig')
        nameBidTable = eosio.table('namebids')
        producersTable = eosio.table('producers')

        decentiumorg = await kit.load('decentiumorg')
        decentiumTrendingTable = decentiumorg.table('trending')
    })

    suite('construct', function () {
        test('defaults', () => {
            const table = new Table({
                abi: eosio.abi,
                account: 'eosio',
                client: mockClient,
                name: 'namebids',
            })
            assert.instanceOf(table, Table)
        })
        test('defaults (typed)', () => {
            const table = new Table({
                abi: eosio.abi,
                account: eosio.account,
                client: mockClient,
                name: Name.from('namebids'),
            })
            assert.instanceOf(table, Table)
        })
        test('throws immediately on table name not included in contract', () => {
            assert.throws(
                () =>
                    new Table({
                        abi: eosio.abi,
                        account: eosio.account,
                        client: mockClient,
                        name: 'foo',
                    })
            )
        })
        test('fieldToIndex', () => {
            const table = new Table({
                abi: decentiumorg.abi,
                account: decentiumorg.account,
                client: mockClient,
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
            const cursor = nameBidTable.query()
            assert.instanceOf(cursor, TableRowCursor)
        })
        test('rowType', async () => {
            @Struct.type('name_bid')
            class NameBid extends Struct {
                @Struct.field(Name) newname!: Name
                @Struct.field(Name) high_bidder!: Name
                @Struct.field(Int64) high_bid!: Int64
                @Struct.field(TimePoint) last_bid_time!: TimePoint
            }
            const table = new Table<NameBid>({
                abi: eosio.abi,
                account: eosio.account,
                client: mockClient,
                name: 'namebids',
                rowType: NameBid,
            })
            assert.instanceOf(table, Table)
            const row = await table.get()
            assert.instanceOf(row, NameBid)
            assert.instanceOf(row.newname, Name)
            assert.instanceOf(row.high_bid, Int64)
        })
        suite('all', () => {
            test('should return every single row in a table', async () => {
                const tableRowCursor = decentiumTrendingTable.query()
                assert.equal((await tableRowCursor.all()).length, 239)
            })
        })
        suite('next', () => {
            test('should allow you to fetch as many rows as possible with one request', async () => {
                const tableRowCursor = decentiumTrendingTable.query()
                assert.equal((await tableRowCursor.next()).length, 239)
            })

            test('should allow you to fetch more rows after first request', async () => {
                const tableRowCursor = nameBidTable.query()
                assert.equal((await tableRowCursor.next()).length, 1000)
                assert.equal((await tableRowCursor.next()).length, 1000)
                assert.equal((await tableRowCursor.next()).length, 1000)
            })
        })
        suite('reset', () => {
            test('should allow you to reset the cursor', async () => {
                const tableRowCursor = decentiumTrendingTable.query({from: 5, to: 6})

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next()).map((row) => row.id),
                    [5, 6]
                )

                assert.deepEqual(
                    (await tableRowCursor.next()).map((row) => row.id),
                    []
                )

                tableRowCursor.reset()

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next()).map((row) => row.id),
                    [5, 6]
                )
            })
        })
    })

    suite('query', () => {
        suite('all', () => {
            test('should fetch table rows correctly when filtering is used', async () => {
                const tableRowCursor = decentiumTrendingTable.query({
                    from: 101511,
                    to: 105056,
                    index: 'score',
                })

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.all()).map((row) => row.score),
                    [101511, 102465, 102507, 103688, 103734, 105056]
                )
            })

            test('should fetch all rows', async () => {
                const contractKit = new ContractKit({
                    client: makeClient('https://jungle4.greymass.com'),
                })
                const contract = await contractKit.load('eosio')
                const rows = await contract.table('delband').query({scope: 'wharfkittest'}).all()
                assert.lengthOf(rows, 40)
            })
            // NOTE: This may not be possible without changes to the wharfkit/antelope library
            test('should return typed rows', async () => {
                const contractKit = new ContractKit({
                    client: makeClient('https://jungle4.greymass.com'),
                })
                const contract = await contractKit.load('eosio')
                const rows = await contract.table('delband').query({scope: 'wharfkittest'}).all()
                assert.instanceOf(rows[0].from, Name)
                assert.instanceOf(rows[0].to, Name)
                assert.instanceOf(rows[0].cpu_weight, Asset)
                assert.instanceOf(rows[0].net_weight, Asset)
            })
        })

        suite('next', () => {
            test('should allow you to fetch more rows after first request', async () => {
                const tableRowCursor = decentiumTrendingTable.query({from: 5})
                assert.equal((await tableRowCursor.next()).length, 235)
                assert.equal((await tableRowCursor.next()).length, 0)
            })

            test('should return typed rows', async () => {
                const contractKit = new ContractKit({
                    client: makeClient('https://jungle4.greymass.com'),
                })
                const contract = await contractKit.load('eosio')
                const rows = await contract.table('delband').query({scope: 'wharfkittest'}).next()
                assert.instanceOf(rows[0].from, Name)
                assert.instanceOf(rows[0].to, Name)
                assert.instanceOf(rows[0].cpu_weight, Asset)
                assert.instanceOf(rows[0].net_weight, Asset)
            })

            test('should fetch correct number of table rows when number is specified in `next` call', async () => {
                const tableRowCursor = decentiumTrendingTable.query({from: 5, to: 10})

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next(2)).map((row) => row.id),
                    [5, 6]
                )

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next(2)).map((row) => row.id),
                    [7, 8]
                )

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next(2)).map((row) => row.id),
                    [9, 10]
                )

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next(2)).map((row) => row.id),
                    []
                )
            })

            test('should fetch correct number of table rows when rowsPerAPIRequest is used', async () => {
                const tableRowCursor = decentiumTrendingTable.query({
                    from: 5,
                    to: 10,
                    rowsPerAPIRequest: 2,
                })

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next()).map((row) => row.id),
                    [5, 6]
                )

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next()).map((row) => row.id),
                    [7, 8]
                )

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next()).map((row) => row.id),
                    [9, 10]
                )

                assert.deepEqual(
                    Serializer.objectify(await tableRowCursor.next()).map((row) => row.id),
                    []
                )
            })
        })
    })

    suite('get', () => {
        test('should fetch table row correctly when filtering by primary index is used', async () => {
            const row = await decentiumTrendingTable.get(5, {key_type: 'i64'})

            assert.deepEqual(Serializer.objectify(row), {
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
            assert.deepEqual(Serializer.objectify(row), {
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
            const row = await producersTable.get('teamgreymass')
            assert.isTrue(row.owner.equals('teamgreymass'))
        })

        test('should return typed data', async () => {
            const row = await producersTable.get('teamgreymass')
            assert.instanceOf(row.owner, Name)
        })

        test('should just get first row without params', async function () {
            const table = eosio.table<EosioGlobalState>('global', EosioGlobalState)
            const row = await table.get()
            assert.instanceOf(row, EosioGlobalState)
            assert.instanceOf(row.pervote_bucket, Int64)
        })
    })

    suite('first', () => {
        test('should establish cursor with first parameters', () => {
            const tableRowCursor = decentiumTrendingTable.query({maxRows: 10})
            assert.equal(tableRowCursor.maxRows, 10)
        })
        suite('scope', function () {
            test('should default to no scope', async () => {
                const table = eosio.table('delband')
                const tableRowCursor = table.query({maxRows: 10})
                const rows = await tableRowCursor.all()
                assert.lengthOf(rows, 2)
            })
            test('should accept a scope', async () => {
                const table = eosio.table('delband')
                const tableRowCursor = table.query({maxRows: 10, scope: 'teamgreymass'})
                const rows = await tableRowCursor.all()
                assert.lengthOf(rows, 3)
            })
        })
        suite('next', () => {
            test('should fetch a specific number of table rows correctly', async () => {
                const tableRowCursor = decentiumTrendingTable.query({maxRows: 10})
                const rows = await tableRowCursor.next()
                assert.lengthOf(rows, 10)
                assert.deepEqual(
                    Serializer.objectify(rows).map((row) => row.id),
                    [0, 1, 2, 3, 5, 6, 7, 8, 9, 10]
                )
                const rows2 = await tableRowCursor.next()
                assert.lengthOf(rows2, 0)
                assert.deepEqual(
                    Serializer.objectify(rows2).map((row) => row.id),
                    []
                )
            })
            test('should allow you to fetch more rows after first request', async () => {
                const tableRowCursor = nameBidTable.query({maxRows: 100000})
                const firstBatch = await tableRowCursor.next()
                const secondBatch = await tableRowCursor.next()
                assert.isFalse(firstBatch[0].newname.equals(secondBatch[0].newname))
            })
            test('should return typed data', async () => {
                const tableRowCursor = nameBidTable.query({maxRows: 100000})
                const batch = await tableRowCursor.next()
                assert.instanceOf(batch[0].high_bidder, Name)
            })
        })

        suite('all', () => {
            test('should fetch all table rows recursively', async () => {
                const cursor = nameBidTable.query({maxRows: 10000})
                const allRequestedRows = await cursor.all()
                assert.equal(allRequestedRows.length, 10000)
            })
            test('should stop if requesting more than exists', async () => {
                const tableRowCursor = decentiumTrendingTable.query({maxRows: 10000})
                const firstBatch = await tableRowCursor.all()
                assert.equal(firstBatch.length, 239)
            })
            test('should return typed data', async () => {
                const tableRowCursor = decentiumTrendingTable.query({maxRows: 10000})
                const batch = await tableRowCursor.all()
                assert.instanceOf(batch[0].ref.category, Name)
            })
        })
    })

    suite('all', () => {
        test('should return every single row in a table', async () => {
            const tableRows = await nameBidTable.all()
            assert.isTrue(tableRows.length > 50000)
        })
        test('should return typed data', async () => {
            const tableRows = await nameBidTable.all()
            assert.instanceOf(tableRows[0].high_bidder, Name)
        })
    })

    suite('scopes', () => {
        test('should return scopes', async () => {
            const scopes = await msig.table('proposal').scopes()
            console.log(scopes)
        })
    })
})
