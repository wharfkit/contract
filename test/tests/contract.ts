import {assert} from 'chai'
import {makeClient, mockPrivateKey, mockSession} from '@wharfkit/mock-data'

import ContractKit, {ActionData, Contract, ContractArgs, Table} from '$lib'
import {ABI, Action, Asset, Name, NameType, PrivateKey, Serializer} from '@wharfkit/antelope'
import {PlaceholderAuth} from '@wharfkit/signing-request'
import {ProducerInfo} from '$test/data/structs/eosio'

const mockClient = makeClient('https://jungle4.greymass.com')

const systemContractArgs: ContractArgs = {
    abi: {version: 'eosio::abi/1.2'},
    account: 'eosio',
    client: mockClient,
}

const mockPublicKey = String(PrivateKey.from(mockPrivateKey).toPublic())

// eosio::newaccount
const newAccountData = {
    creator: PlaceholderAuth.actor,
    name: 'foo',
    owner: {
        accounts: [],
        keys: [
            {
                key: mockPublicKey,
                weight: 1,
            },
        ],
        threshold: 1,
        waits: [],
    },
    active: {
        accounts: [],
        keys: [
            {
                key: mockPublicKey,
                weight: 1,
            },
        ],
        threshold: 1,
        waits: [],
    },
}

// eosio::buyrambytes
const buyRamBytesData = {
    payer: PlaceholderAuth.actor,
    receiver: 'foo',
    bytes: 8192,
}

// eosio::delegatebw
const delegateBwData = {
    from: PlaceholderAuth.actor,
    receiver: 'foo',
    stake_net_quantity: '1.0000 EOS',
    stake_cpu_quantity: '1.0000 EOS',
    transfer: false,
}

// eosio.token::transfer
const transferData = {
    from: PlaceholderAuth.actor,
    to: 'foo',
    quantity: '1.0000 EOS',
    memo: 'initial balance',
}

// Mocks data for the first action defined in the contract for testing purposes
function getMockParams(contract: Contract): ActionData {
    switch (String(contract.account)) {
        case 'eosio': {
            return {
                feature_digest: '331f0fae3454c34ed2c5e84aeaf6143ce8e0b0678a6d57c25349363a4d590f41',
            }
        }
        case 'eosio.token': {
            return {
                owner: 'foo',
                symbol: '4,EOS',
            }
        }
        case 'rewards.gm': {
            return {
                account: 'foo',
                weight: 1,
            }
        }
        default: {
            throw new Error(`getMockParams not implemented for ${contract.account}`)
        }
    }
}

export function runGenericContractTests(contract: Contract) {
    suite('tableNames', function () {
        test('contains tables', function () {
            assert.isArray(contract.tableNames)
            assert.isTrue(contract.tableNames.length > 0)
        })
    })
    suite('table', function () {
        test('load table using Name', function () {
            const tableName = Name.from(contract.tableNames[0])
            const table = contract.table(tableName)
            assert.instanceOf(table, Table)
            assert.isTrue(table.name.equals(tableName))
        })
        test('load table using string', function () {
            const tableName = contract.tableNames[0]
            const table = contract.table(tableName)
            assert.instanceOf(table, Table)
            assert.isTrue(table.name.equals(tableName))
        })
        test('throws on invalid name', function () {
            assert.throws(() => contract.table('foo'))
        })
    })
    suite('actionNames', function () {
        test('contains actions', function () {
            assert.isArray(contract.actionNames)
            assert.isTrue(contract.actionNames.length > 0)
        })
    })
    suite('action', function () {
        test('load action using Name', function () {
            const actionName = Name.from(contract.actionNames[0])
            const params = getMockParams(contract)
            const action = contract.action(actionName)(params)
            assert.instanceOf(action, Action)
            assert.isTrue(action.name.equals(actionName))
        })
        test('load action using string', function () {
            const actionName = contract.actionNames[0]
            const params = getMockParams(contract)
            const action = contract.action(actionName)(params)
            assert.instanceOf(action, Action)
            assert.isTrue(action.name.equals(actionName))
        })
        test('throws on invalid name', function () {
            assert.throws(() => contract.action('foo')({}))
        })
    })
}

;(async function () {
    const mockKit = new ContractKit({
        client: mockClient,
    })
    const systemContract = await mockKit.load('eosio')
    const tokenContract = await mockKit.load('eosio.token')

    suite('Contract', () => {
        suite('construct', function () {
            test('typed', function () {
                const contract = new Contract({
                    ...systemContractArgs,
                    abi: ABI.from(systemContractArgs.abi),
                    account: Name.from(systemContractArgs.account),
                })
                assert.instanceOf(contract, Contract)
            })
            test('untyped', function () {
                const contract = new Contract(systemContractArgs)
                assert.instanceOf(contract, Contract)
            })
        })

        suite('specific contract', function () {
            suite('system contract', function () {
                suite('generic tests', async () => {
                    runGenericContractTests(systemContract)
                })
                suite('tableNames', function () {
                    test('validate for contract', function () {
                        assert.lengthOf(systemContract.tableNames, 26)
                        assert.isTrue(systemContract.tableNames.includes('voters'))
                    })
                })
                suite('table', function () {
                    test('should accept rowType', async function () {
                        const table = systemContract.table<ProducerInfo>('producers', ProducerInfo)
                        assert.instanceOf(table, Table)
                        const producer = await table.get('lioninjungle')
                        assert.instanceOf(producer, ProducerInfo)
                        assert.instanceOf(producer.owner, Name)
                        assert.isTrue(producer.owner.equals('lioninjungle'))
                    })
                })
                suite('actions', function () {
                    test('create array of actions', async function () {
                        const actions: Action[] = [
                            ...systemContract.actions([
                                {
                                    name: 'newaccount',
                                    data: newAccountData,
                                },
                                {
                                    name: 'buyrambytes',
                                    data: {
                                        payer: PlaceholderAuth.actor,
                                        receiver: 'foo',
                                        bytes: 8192,
                                    },
                                },
                                {
                                    name: 'delegatebw',
                                    data: delegateBwData,
                                },
                            ]),
                        ]
                        assert.lengthOf(actions, 3)
                        assert.isTrue(actions[0].account.equals('eosio'))
                        assert.isTrue(actions[0].name.equals('newaccount'))
                        assert.lengthOf(actions[0].authorization, 1)
                        assert.isTrue(actions[0].authorization[0].equals(PlaceholderAuth))
                        assert.isTrue(actions[1].account.equals('eosio'))
                        assert.isTrue(actions[1].name.equals('buyrambytes'))
                        assert.lengthOf(actions[1].authorization, 1)
                        assert.isTrue(actions[1].authorization[0].equals(PlaceholderAuth))
                        assert.isTrue(actions[2].account.equals('eosio'))
                        assert.isTrue(actions[2].name.equals('delegatebw'))
                        assert.lengthOf(actions[2].authorization, 1)
                        assert.isTrue(actions[2].authorization[0].equals(PlaceholderAuth))
                        const result = await mockSession.transact({actions})
                        if (!result.transaction) {
                            throw new Error('expected transaction')
                        }
                        assert.lengthOf(result.transaction.actions, 3)
                    })
                    suite('override', function () {
                        test('authorization (all)', function () {
                            const actions: Action[] = systemContract.actions(
                                [
                                    {
                                        name: 'newaccount',
                                        data: newAccountData,
                                    },
                                    {
                                        name: 'buyrambytes',
                                        data: buyRamBytesData,
                                    },
                                    {
                                        name: 'delegatebw',
                                        data: delegateBwData,
                                    },
                                ],
                                {
                                    authorization: [{actor: 'foo', permission: 'bar'}],
                                }
                            )
                            assert.lengthOf(actions, 3)
                            assert.isTrue(actions[0].authorization[0].actor.equals('foo'))
                            assert.isTrue(actions[0].authorization[0].permission.equals('bar'))
                            assert.lengthOf(actions[0].authorization, 1)
                            assert.isTrue(actions[1].authorization[0].actor.equals('foo'))
                            assert.isTrue(actions[1].authorization[0].permission.equals('bar'))
                            assert.lengthOf(actions[1].authorization, 1)
                            assert.isTrue(actions[2].authorization[0].actor.equals('foo'))
                            assert.isTrue(actions[2].authorization[0].permission.equals('bar'))
                            assert.lengthOf(actions[2].authorization, 1)
                        })
                        test('authorization (individual)', function () {
                            const actions: Action[] = systemContract.actions([
                                {
                                    name: 'newaccount',
                                    data: newAccountData,
                                },
                                {
                                    name: 'buyrambytes',
                                    data: buyRamBytesData,
                                    authorization: [{actor: 'foo', permission: 'bar'}],
                                },
                                {
                                    name: 'delegatebw',
                                    data: delegateBwData,
                                },
                            ])
                            assert.lengthOf(actions, 3)
                            assert.isTrue(actions[0].authorization[0].equals(PlaceholderAuth))
                            assert.lengthOf(actions[0].authorization, 1)
                            assert.isTrue(actions[1].authorization[0].actor.equals('foo'))
                            assert.isTrue(actions[1].authorization[0].permission.equals('bar'))
                            assert.lengthOf(actions[1].authorization, 1)
                            assert.isTrue(actions[2].authorization[0].equals(PlaceholderAuth))
                            assert.lengthOf(actions[2].authorization, 1)
                        })
                    })
                })
                suite('actionNames', function () {
                    test('validate for contract', function () {
                        assert.isArray(systemContract.actionNames)
                        assert.lengthOf(systemContract.actionNames, 62)
                        assert.isTrue(systemContract.actionNames.includes('newaccount'))
                    })
                })
            })
            suite('token contract', function () {
                suite('generic tests', async () => {
                    runGenericContractTests(tokenContract)
                })
                suite('action', function () {
                    suite('load', function () {
                        test('using Name', function () {
                            const action = tokenContract.action(Name.from('transfer'))(transferData)
                            assert.instanceOf(action, Action)
                            assert.isTrue(action.account.equals('eosio.token'))
                            assert.isTrue(action.name.equals('transfer'))
                            assert.isTrue(
                                action.authorization[0].equals({
                                    actor: PlaceholderAuth.actor,
                                    permission: PlaceholderAuth.permission,
                                })
                            )
                            const encoded = Serializer.encode({
                                object: transferData,
                                type: 'transfer',
                                abi: tokenContract.abi,
                            })
                            assert.isTrue(action.data.equals(encoded))
                        })
                        test('using string', function () {
                            const action = tokenContract.action('transfer')(transferData)
                            assert.instanceOf(action, Action)
                            assert.isTrue(action.account.equals('eosio.token'))
                            assert.isTrue(action.name.equals('transfer'))
                        })
                        test('defaults to placeholders', function () {
                            const action = tokenContract.action('transfer')(transferData)
                            assert.isTrue(action.authorization[0].equals(PlaceholderAuth))
                        })
                    })
                    suite('throws', function () {
                        test('with incomplete action data', async function () {
                            assert.throws(() =>
                                tokenContract.action('transfer')({
                                    from: 'foo',
                                    to: 'bar',
                                    quantity: '1.0000 EOS',
                                })
                            )
                        })
                        test('with invalid action data', async function () {
                            assert.throws(() =>
                                tokenContract.action('transfer')({
                                    ...transferData,
                                    to: Asset.from('1.0000 EOS'),
                                })
                            )
                        })
                        test('with invalid name', async function () {
                            assert.throws(() => tokenContract.action('foo')(transferData))
                        })
                    })
                    suite('overrides', function () {
                        test('authorization', async function () {
                            const action = tokenContract.action('transfer')(transferData, {
                                authorization: [
                                    {
                                        actor: 'foo',
                                        permission: 'bar',
                                    },
                                ],
                            })
                            assert.isTrue(
                                action.authorization[0].equals({
                                    actor: 'foo',
                                    permission: 'bar',
                                })
                            )
                        })
                    })
                })
            })
        })

        suite('ricardian', () => {
            test('returns ricardian contract', async function () {
                const kit = new ContractKit({
                    client: makeClient('https://eos.greymass.com'),
                })
                const contract = await kit.load('eosio.token')
                const ricardian = await contract.ricardian('transfer')
                assert.isString(ricardian)
            })
            test('throws for unknown action', async function () {
                let error
                try {
                    await tokenContract.ricardian('foo')
                } catch (err) {
                    error = err
                }
                assert.instanceOf(error, Error)
            })
            test('throws for an undefined ricardian', async function () {
                let error
                try {
                    await tokenContract.ricardian('transfer')
                } catch (err) {
                    error = err
                }
                assert.instanceOf(error, Error)
            })
        })
    })
})()
