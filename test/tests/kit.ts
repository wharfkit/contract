import {assert} from 'chai'

import {Contract, ContractKit, ContractKitArgs} from '$lib'
import {ABICache} from '@wharfkit/abicache'
import {ABI, Name} from '@wharfkit/antelope'
import {makeClient} from '@wharfkit/mock-data'

const mockClient = makeClient('https://jungle4.greymass.com')
const mockContractKitArgs: ContractKitArgs = {
    client: mockClient,
}

suite('Kit', function () {
    suite('construct', function () {
        test('defaults', function () {
            const kit = new ContractKit(mockContractKitArgs)
            assert.instanceOf(kit, ContractKit)
        })
        test('args: client', function () {
            assert.doesNotThrow(() => {
                const kit = new ContractKit({client: mockClient})
                assert.instanceOf(kit, ContractKit)
            })
        })
        test('options: abiCache', function () {
            const kit = new ContractKit(mockContractKitArgs, {
                abiCache: new ABICache(mockClient),
            })
            assert.instanceOf(kit, ContractKit)
            assert.instanceOf(kit.abiCache, ABICache)
        })
        test('options: debug', async function () {
            const kit = new ContractKit(mockContractKitArgs, {
                debug: true,
            })
            assert.instanceOf(kit, ContractKit)
            assert.isTrue(kit.debug)
            const contract = await kit.load('eosio.token')
            assert.instanceOf(contract, Contract)
            assert.isTrue(contract.debug)
            const table = contract.table('accounts')
            assert.isTrue(table.debug)
        })
        suite('options: abis', function () {
            test('untyped', async function () {
                const kit = new ContractKit(mockContractKitArgs, {
                    abis: [
                        {
                            name: 'foo',
                            abi: {version: 'eosio::abi/1.2'},
                        },
                        {
                            name: 'bar',
                            abi: {version: 'eosio::abi/1.2'},
                        },
                    ],
                })
                assert.instanceOf(kit, ContractKit)
                assert.equal(kit.abiCache.cache.size, 2)
                const foo = await kit.load('foo')
                assert.instanceOf(foo, Contract)
                const bar = await kit.load('bar')
                assert.instanceOf(bar, Contract)
            })
            test('typed', async function () {
                const kit = new ContractKit(mockContractKitArgs, {
                    abis: [
                        {
                            name: Name.from('foo'),
                            abi: ABI.from({version: 'eosio::abi/1.2'}),
                        },
                        {
                            name: Name.from('bar'),
                            abi: ABI.from({version: 'eosio::abi/1.2'}),
                        },
                    ],
                })
                assert.instanceOf(kit, ContractKit)
                assert.equal(kit.abiCache.cache.size, 2)
                const foo = await kit.load('foo')
                assert.instanceOf(foo, Contract)
                const bar = await kit.load('bar')
                assert.instanceOf(bar, Contract)
            })
        })
    })
    suite('load', function () {
        let contractKit
        setup(() => {
            contractKit = new ContractKit(mockContractKitArgs)
        })
        test('fetches abi', async function () {
            const contract = await contractKit.load('eosio.token')
            assert.instanceOf(contract, Contract)
        })
    })
})
