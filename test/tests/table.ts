import {assert} from 'chai'

import ContractKit, {Contract, Table, TableRowCursor, TableScopeCursor} from '$lib'

import {EosioGlobalState} from '$test/data/structs/eosio'
import {Asset, Int64, Name, Serializer, Struct, TimePoint, UInt32} from '@wharfkit/antelope'
import {makeClient} from '@wharfkit/mock-data'

const mockClient = makeClient('https://eos.greymass.com')

suite('Table', () => {
    let kit: ContractKit
    let eosio: Contract
    let msig: Contract
    let decentiumorg: Contract
    let drops: Contract

    let nameBidTable
    let decentiumTrendingTable
    let producersTable
    let proposalTable: Table
    let dropTable: Table

    setup(async function () {
        kit = new ContractKit({
            client: mockClient,
        })

        eosio = await kit.load('eosio')
        msig = await kit.load('eosio.msig')
        drops = await kit.load('drops')

        proposalTable = msig.table('proposal')
        nameBidTable = eosio.table('namebids')
        producersTable = eosio.table('producers')
        dropTable = drops.table('drop')

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
        test('defaultScope', () => {
            const table = new Table({
                abi: decentiumorg.abi,
                account: decentiumorg.account,
                client: mockClient,
                name: Name.from('trending'),
                defaultScope: 'foo',
            })
            assert.instanceOf(table, Table)
            assert.equal(table.defaultScope, 'foo')
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
            assert.instanceOf(row?.newname, Name)
            assert.instanceOf(row?.high_bid, Int64)
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

            test('should be able to query for a js value of 0', async () => {
                const tableRowCursor = dropTable.query({
                    from: 0,
                    to: 0,
                })
                const rows = await tableRowCursor.next()
                assert.lengthOf(rows, 0)
            })

            test('should fetch table rows correctly when filtering is used (index_position)', async () => {
                const tableRowCursor = decentiumTrendingTable.query({
                    from: 101511,
                    to: 105056,
                    index_position: 'secondary',
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

        suite('scopes', function () {
            test('should work with numeric scopes', async function () {
                const testKit = new ContractKit({
                    client: makeClient('https://wax.greymass.com'),
                })

                const contract = await testKit.load('alcordexmain')

                const rowsBuyIntScope = await contract.table('buyorder').query({scope: 0}).all()
                const rowsSellIntScope = await contract.table('sellorder').query({scope: 0}).all()
                assert.equal(rowsBuyIntScope.length, 144)
                assert.equal(rowsSellIntScope.length, 348)

                const rowsBuyTxtScope = await contract.table('buyorder').query({scope: '0'}).all()
                const rowsSellTxtScope = await contract.table('sellorder').query({scope: '0'}).all()
                assert.equal(rowsBuyTxtScope.length, 144)
                assert.equal(rowsSellTxtScope.length, 348)
            })
        })

        test('reverse', async function () {
            const tableRowCursor = decentiumTrendingTable.query({from: 5, to: 6, reverse: true})
            tableRowCursor.reset()

            assert.deepEqual(
                Serializer.objectify(await tableRowCursor.next()).map((row) => row.id),
                [6, 5]
            )
        })

        test('should return deserialized data in debug', async function () {
            const table = new Table({
                abi: eosio.abi,
                account: 'eosio',
                client: mockClient,
                name: 'global',
                debug: true,
            })
            const row = await table.all()
            assert.deepEqual(row, JSON.parse(JSON.stringify(row)))
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
            const table = eosio.table<EosioGlobalState>('global', undefined, EosioGlobalState)
            const row = await table.get()
            assert.instanceOf(row, EosioGlobalState)
            assert.instanceOf(row.pervote_bucket, Int64)
        })

        test('should use scope from table call', async function () {
            const contractKit = new ContractKit({
                client: makeClient('https://jungle4.greymass.com'),
            })
            const contract = await contractKit.load('eosio.token')
            const result = await contract.table('accounts', 'wharfkittest').get()
            assert.instanceOf(result.balance, Asset)
        })

        test('should return undefined when no entry is found', async function () {
            const row = await producersTable.get('doesnotexist')

            assert.isUndefined(row)
        })

        test('should return deserialized data in debug', async function () {
            const table = new Table({
                abi: eosio.abi,
                account: 'eosio',
                client: mockClient,
                name: 'namebids',
                debug: true,
            })
            const row = await table.get()
            assert.deepEqual(row, JSON.parse(JSON.stringify(row)))
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

        test('should return deserialized data in debug', async function () {
            const table = new Table({
                abi: eosio.abi,
                account: 'eosio',
                client: mockClient,
                name: 'global',
                debug: true,
            })
            const cursor = await table.query()
            const row = await cursor.all()
            assert.deepEqual(row, JSON.parse(JSON.stringify(row)))
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
        test('should return deserialized data in debug', async function () {
            const table = new Table({
                abi: eosio.abi,
                account: 'eosio',
                client: mockClient,
                name: 'global',
                debug: true,
            })
            const row = await table.all()
            assert.deepEqual(row, JSON.parse(JSON.stringify(row)))
        })
    })

    suite('scopes', () => {
        test('should return a scope cursor', async () => {
            const scopes = await msig.table('proposal').scopes()
            assert.instanceOf(scopes, TableScopeCursor)
        })

        suite('all', () => {
            test('should fetch all table scopes', async () => {
                const tableScopeCursor = proposalTable.scopes()
                const rows = await tableScopeCursor.all()
                assert.lengthOf(rows, 1633)
            })
            test('should fetch all table scopes with filtering', async () => {
                const tableScopeCursor = proposalTable.scopes({
                    from: 'teamgreymass',
                    to: 'telosdompet1',
                })
                const rows = await tableScopeCursor.all()
                assert.lengthOf(rows, 4)
                assert.deepEqual(
                    Serializer.objectify(rows).map((row) => row.scope),
                    ['teamgreymass', 'teegway2day1', 'tella15.ftw', 'telosdompet1']
                )
            })
            test('should return typed rows', async () => {
                const tableScopeCursor = proposalTable.scopes({
                    from: 'teamgreymass',
                    to: 'telosdompet1',
                })
                const rows = await tableScopeCursor.all()
                assert.instanceOf(rows[0].code, Name)
                assert.instanceOf(rows[0].scope, Name)
                assert.instanceOf(rows[0].table, Name)
                assert.instanceOf(rows[0].payer, Name)
                assert.instanceOf(rows[0].count, UInt32)
            })
        })

        suite('next', () => {
            test('should allow you to fetch more scopes after first request', async () => {
                const tableScopeCursor = proposalTable.scopes()
                const rows1 = await tableScopeCursor.next(10)
                assert.equal(rows1.length, 10)
                assert.isTrue(
                    rows1[0].scope.equals('1111111zzzzz'),
                    `Expected ${rows1[0].scope} to equal 1111111zzzzz`
                )
                const rows2 = await tableScopeCursor.next(10)
                assert.equal(rows2.length, 10)
                assert.isTrue(
                    rows2[0].scope.equals('1charcha.ftw'),
                    `Expected ${rows2[0].scope} to equal 1charcha.ftw`
                )
            })

            test('should return typed rows', async () => {
                const tableScopeCursor = proposalTable.scopes()
                const rows = await tableScopeCursor.next(10)
                assert.instanceOf(rows[0].code, Name)
                assert.instanceOf(rows[0].scope, Name)
                assert.instanceOf(rows[0].table, Name)
                assert.instanceOf(rows[0].payer, Name)
                assert.instanceOf(rows[0].count, UInt32)
            })

            test('should fetch correct number of scope rows when rowsPerAPIRequest is used', async () => {
                const tableScopeCursor = proposalTable.scopes({
                    rowsPerAPIRequest: 2,
                })

                assert.deepEqual(
                    Serializer.objectify(await tableScopeCursor.next()).map((row) => row.scope),
                    ['1111111zzzzz', '113332.pcash']
                )

                assert.deepEqual(
                    Serializer.objectify(await tableScopeCursor.next()).map((row) => row.scope),
                    ['11rippche24y', '121moe.ftw']
                )

                assert.deepEqual(
                    Serializer.objectify(await tableScopeCursor.next()).map((row) => row.scope),
                    ['12235213.ftw', '123ahmet.ftw']
                )
            })
        })
    })
})
