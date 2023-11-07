import {assert} from 'chai'

import ContractKit, {Contract, TableRowCursor} from '$lib'

import {TrendingRow} from '$test/data/structs/decentium'
import {DelegatedBandwidth, NameBid} from '$test/data/structs/eosio'
import {Name, Serializer, UInt64} from '@wharfkit/antelope'
import {makeClient} from '@wharfkit/mock-data'

const mockClient = makeClient('https://eos.greymass.com')

suite('Cursor', () => {
    let kit: ContractKit
    let eosio: Contract
    let decentiumorg: Contract

    setup(async function () {
        kit = new ContractKit({
            client: mockClient,
        })
        eosio = await kit.load('eosio')
        decentiumorg = await kit.load('decentiumorg')
    })

    suite('constructor', function () {
        suite('generics', function () {
            test('without generics or type', async function () {
                const cursor = new TableRowCursor({
                    abi: eosio.abi,
                    client: mockClient,
                    params: {
                        code: Name.from('eosio'),
                        table: Name.from('delband'),
                    },
                })
                assert.instanceOf(cursor, TableRowCursor)
                const result = await cursor.next(1)
                assert.lengthOf(result, 1)
                assert.isObject(result[0])
                assert.notInstanceOf(result[0], DelegatedBandwidth)
                assert.instanceOf(result[0].from, Name)
            })
            test('with generics and no type', async function () {
                const cursor = new TableRowCursor<DelegatedBandwidth>({
                    abi: eosio.abi,
                    client: mockClient,
                    params: {
                        code: Name.from('eosio'),
                        table: Name.from('delband'),
                    },
                })
                assert.instanceOf(cursor, TableRowCursor)
                const result = await cursor.next(1)
                assert.lengthOf(result, 1)
                assert.isObject(result[0])
                assert.notInstanceOf(result[0], DelegatedBandwidth)
                assert.instanceOf(result[0].from, Name)
            })
            test('with generics and type', async function () {
                const cursor = new TableRowCursor<DelegatedBandwidth>({
                    abi: eosio.abi,
                    client: mockClient,
                    params: {
                        code: Name.from('eosio'),
                        table: Name.from('delband'),
                        type: DelegatedBandwidth,
                    },
                })
                assert.instanceOf(cursor, TableRowCursor)
                const result = await cursor.next(1)
                assert.lengthOf(result, 1)
                assert.isObject(result[0])
                assert.instanceOf(result[0], DelegatedBandwidth)
                assert.instanceOf(result[0].from, Name)
            })
        })
        suite('params', function () {
            test('typed minimal', async () => {
                const cursor = new TableRowCursor({
                    abi: eosio.abi,
                    client: mockClient,
                    params: {
                        code: Name.from('eosio'),
                        table: Name.from('delband'),
                    },
                })
                assert.instanceOf(cursor, TableRowCursor)
                const result = await cursor.next(1)
                assert.lengthOf(result, 1)
                assert.instanceOf(result[0].from, Name)
                assert.isTrue(result[0].from.equals('eosio'))
            })
            test('untyped minimal', async () => {
                const cursor = new TableRowCursor({
                    abi: eosio.abi,
                    client: mockClient,
                    params: {
                        code: 'eosio',
                        table: 'delband',
                    },
                })
                assert.instanceOf(cursor, TableRowCursor)
                const result = await cursor.next(1)
                assert.lengthOf(result, 1)
                assert.instanceOf(result[0].from, Name)
                assert.isTrue(result[0].from.equals('eosio'))
            })
            suite('scope', function () {
                test('string', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'delband',
                            scope: 'teamgreymass',
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next(1)
                    assert.lengthOf(result, 1)
                    assert.instanceOf(result[0].from, Name)
                    assert.isTrue(result[0].from.equals('teamgreymass'))
                })
                test('Name', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'delband',
                            scope: Name.from('teamgreymass'),
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next(1)
                    assert.lengthOf(result, 1)
                    assert.instanceOf(result[0].from, Name)
                    assert.isTrue(result[0].from.equals('teamgreymass'))
                })
                test('no results', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'delband',
                            scope: 'foofoofoo',
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next(1)
                    assert.lengthOf(result, 0)
                })
            })
            suite('bounds', function () {
                test('string', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'producers',
                            lower_bound: 'teamgreymass',
                            upper_bound: 'teamgreymass',
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next(1)
                    assert.lengthOf(result, 1)
                    assert.instanceOf(result[0].owner, Name)
                    assert.isTrue(result[0].owner.equals('teamgreymass'))
                })
                test('Name', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'producers',
                            lower_bound: Name.from('teamgreymass'),
                            upper_bound: Name.from('teamgreymass'),
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next(1)
                    assert.lengthOf(result, 1)
                    assert.instanceOf(result[0].owner, Name)
                    assert.isTrue(result[0].owner.equals('teamgreymass'))
                })
                test('no results', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'producers',
                            lower_bound: Name.from('foo'),
                            upper_bound: Name.from('foo'),
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next(1)
                    assert.lengthOf(result, 0)
                })
                test('only lower_bounds', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'producers',
                            lower_bound: 'teamgreymass',
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next(1)
                    assert.lengthOf(result, 1)
                    assert.instanceOf(result[0].owner, Name)
                    assert.isTrue(result[0].owner.equals('teamgreymass'))
                })
                test('only upper_bounds', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'producers',
                            upper_bound: 'teamgreymass',
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next(1)
                    assert.lengthOf(result, 1)
                    assert.instanceOf(result[0].owner, Name)
                    assert.isTrue(result[0].owner.equals('111112222244'))
                })
            })
            suite('limit', function () {
                test('default', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'namebids',
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next()
                    assert.lengthOf(result, 1000)
                    assert.instanceOf(result[0].high_bidder, Name)
                    assert.isTrue(result[0].high_bidder.equals('guydgnjygige'))
                })
                test('override', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'namebids',
                            limit: 10,
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next()
                    assert.lengthOf(result, 10)
                    assert.instanceOf(result[0].high_bidder, Name)
                    assert.isTrue(result[0].high_bidder.equals('guydgnjygige'))
                })
            })
            suite('type', function () {
                test('serialized (default)', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'namebids',
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next()
                    assert.instanceOf(result[0].high_bidder, Name)
                    assert.isTrue(result[0].high_bidder.equals('guydgnjygige'))
                })
                test('untyped', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'namebids',
                            json: true,
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next()
                    assert.isString(result[0].high_bidder)
                    assert.equal(result[0].high_bidder, 'guydgnjygige')
                })
                test('Struct', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'namebids',
                            type: NameBid,
                        },
                    })
                    assert.instanceOf(cursor, TableRowCursor)
                    const result = await cursor.next()
                    assert.instanceOf(result[0], NameBid)
                    assert.instanceOf(result[0].high_bidder, Name)
                    assert.isTrue(result[0].high_bidder.equals('guydgnjygige'))
                })
            })
        })
        suite('old tests', function () {
            suite('all', () => {
                test('should return every single row in a table', async () => {
                    const cursor = new TableRowCursor({
                        abi: decentiumorg.abi,
                        client: mockClient,
                        params: {
                            code: 'decentiumorg',
                            table: 'trending',
                        },
                    })
                    assert.equal((await cursor.all()).length, 239)
                })
            })
            suite('next', () => {
                test('should allow you to fetch as many rows as possible with one request', async () => {
                    const cursor = new TableRowCursor({
                        abi: decentiumorg.abi,
                        client: mockClient,
                        params: {
                            code: 'decentiumorg',
                            table: 'trending',
                        },
                    })
                    assert.equal((await cursor.next()).length, 239)
                })

                test('should allow you to fetch more rows after first request', async () => {
                    const cursor = new TableRowCursor({
                        abi: eosio.abi,
                        client: mockClient,
                        params: {
                            code: 'eosio',
                            table: 'namebids',
                        },
                    })
                    assert.equal((await cursor.next()).length, 1000)
                    assert.equal((await cursor.next()).length, 1000)
                    assert.equal((await cursor.next()).length, 1000)
                })
            })
            suite('reset', () => {
                test('foooooo should allow you to reset the cursor', async () => {
                    const cursor = new TableRowCursor({
                        abi: decentiumorg.abi,
                        client: mockClient,
                        params: {
                            code: 'decentiumorg',
                            table: 'trending',
                            lower_bound: UInt64.from(5),
                            upper_bound: UInt64.from(6),
                            type: TrendingRow,
                            limit: 2,
                        },
                    })

                    const rows = await cursor.next()
                    assert.deepEqual(
                        rows.map((row) => Number(row.id)),
                        [5, 6]
                    )

                    assert.deepEqual(
                        (await cursor.next()).map((row) => row.id),
                        []
                    )

                    cursor.reset()

                    assert.deepEqual(
                        Serializer.objectify(await cursor.next()).map((row) => row.id),
                        [5, 6]
                    )
                })
            })
        })
    })
})
