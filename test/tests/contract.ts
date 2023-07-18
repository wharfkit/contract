import {assert} from 'chai'
import {makeClient, mockPrivateKey, mockSession} from '@wharfkit/mock-data'

import ContractKit, {Contract, ContractArgs, Table} from '$lib'
import {
    ABI,
    Action,
    Asset,
    Name,
    PlaceholderAuth,
    PrivateKey,
    ResolvedSigningRequest,
    Serializer,
    Session,
    Transaction,
} from '@wharfkit/session'

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

// eosio.token::open
const openData = {
    owner: 'foo',
    symbol: '4,EOS',
    ram_payer: PlaceholderAuth.actor,
}

// eosio.token::transfer
const transferData = {
    from: PlaceholderAuth.actor,
    to: 'foo',
    quantity: '1.0000 EOS',
    memo: 'initial balance',
}

suite('Contract', () => {
    let mockKit: ContractKit
    let systemContract: Contract
    let tokenContract: Contract

    setup(async function () {
        mockKit = new ContractKit({
            client: mockClient,
        })
        systemContract = await mockKit.load('eosio')
        tokenContract = await mockKit.load('eosio.token')
    })

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
        test('with Session', function () {
            const contract = new Contract(systemContractArgs, {session: mockSession})
            assert.instanceOf(contract, Contract)
            assert.instanceOf(contract.session, Session)
        })
    })

    suite('tableNames', function () {
        test('list table names', function () {
            assert.isArray(systemContract.tableNames)
            assert.lengthOf(systemContract.tableNames, 26)
            assert.isTrue(systemContract.tableNames.includes('voters'))
        })
    })

    suite('table', function () {
        test('load table using Name', function () {
            const table = systemContract.table('voters')
            assert.instanceOf(table, Table)
            assert.isTrue(table.name.equals('voters'))
        })
        test('load table using string', function () {
            const table = systemContract.table(Name.from('voters'))
            assert.instanceOf(table, Table)
            assert.isTrue(table.name.equals('voters'))
        })
        test('throws on invalid name', function () {
            assert.throws(() => systemContract.table('foo'))
        })
    })

    suite('action', function () {
        suite('load', function () {
            test('using Name', function () {
                const action = tokenContract.action(Name.from('transfer'), transferData)
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
                const action = tokenContract.action('transfer', transferData)
                assert.instanceOf(action, Action)
                assert.isTrue(action.account.equals('eosio.token'))
                assert.isTrue(action.name.equals('transfer'))
            })
            test('defaults to placeholders', function () {
                const action = tokenContract.action('transfer', transferData)
                assert.isTrue(action.authorization[0].equals(PlaceholderAuth))
            })
        })
        suite('throws', function () {
            test('with incomplete action data', async function () {
                assert.throws(() =>
                    tokenContract.action('transfer', {
                        from: 'foo',
                        to: 'bar',
                        quantity: '1.0000 EOS',
                    })
                )
            })
            test('with invalid action data', async function () {
                assert.throws(() =>
                    tokenContract.action('transfer', {
                        ...transferData,
                        to: Asset.from('1.0000 EOS'),
                    })
                )
            })
            test('with invalid name', async function () {
                assert.throws(() => tokenContract.action('foo', transferData))
            })
        })
        suite('overrides', function () {
            test('authorization', async function () {
                const action = tokenContract.action('transfer', transferData, {
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
                        data: buyRamBytesData,
                    },
                    {
                        name: 'delegatebw',
                        data: delegateBwData,
                    },
                ]),
                tokenContract.action('open', openData),
            ]
            assert.lengthOf(actions, 4)
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
            assert.isTrue(actions[3].account.equals('eosio.token'))
            assert.isTrue(actions[3].name.equals('open'))
            assert.lengthOf(actions[3].authorization, 1)
            assert.isTrue(actions[3].authorization[0].equals(PlaceholderAuth))
            const result = await mockSession.transact({actions})
            if (!result.transaction) {
                throw new Error('expected transaction')
            }
            assert.lengthOf(result.transaction.actions, 4)
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
        test('returns list', function () {
            assert.isArray(systemContract.actionNames)
            assert.lengthOf(systemContract.actionNames, 62)
            assert.isTrue(systemContract.actionNames.includes('newaccount'))
        })
    })

    suite('call', () => {
        test('succeeds with session', async function () {
            await systemContract.call('newaccount', newAccountData, {session: mockSession})
        })
        test('throws without a session', async function () {
            let error
            try {
                await systemContract.call('newaccount', newAccountData)
            } catch (err) {
                error = err
            }
            assert.instanceOf(error, Error)
        })
        test('templates using placeholders', async function () {
            const response = await tokenContract.call('transfer', transferData, {
                session: mockSession,
            })
            const {resolved} = response
            assert.instanceOf(resolved, ResolvedSigningRequest)
            if (resolved) {
                const {transaction} = resolved
                assert.instanceOf(transaction, Transaction)
                if (transaction) {
                    assert.equal(transaction.actions.length, 1)
                    const action = transaction.actions[0]
                    assert.isTrue(action.account.equals('eosio.token'))
                    assert.isTrue(action.name.equals('transfer'))
                    assert.lengthOf(action.authorization, 1)
                    assert.isTrue(action.authorization[0].actor.equals('wharfkit1111'))
                    assert.isTrue(action.authorization[0].permission.equals('test'))
                    assert.isTrue(
                        action.data.equals(
                            '104208d9c1754de3000000000000285d102700000000000004454f53000000000f696e697469616c2062616c616e6365'
                        )
                    )
                }
            }
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
