import {Action, Name} from '@wharfkit/antelope'
import {assert} from 'chai'

import {ActionDataType, Contract, Table} from '@wharfkit/contract'

// Mocks data for the first action defined in the contract for testing purposes
export function getMockParams(contract: Contract): ActionDataType {
    switch (String(contract.account)) {
        case 'eosio': {
            return {
                feature_digest: '331f0fae3454c34ed2c5e84aeaf6143ce8e0b0678a6d57c25349363a4d590f41',
            }
        }
        case 'eosio.msig': {
            return {
                proposer: 'foo',
                proposal_name: 'bar',
                level: {
                    actor: 'foo',
                    permission: 'active',
                },
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

export function runGenericContractTests(getContract: () => Contract) {
    suite('tableNames', function () {
        test('contains tables', function () {
            const contract = getContract()
            assert.isArray(contract.tableNames)
            assert.isTrue(contract.tableNames.length > 0)
        })
    })

    suite('table', function () {
        test('loads table using Name', function () {
            const contract = getContract()
            const tableName = Name.from(contract.tableNames[0])
            const table = contract.table(tableName)
            assert.instanceOf(table, Table)
            assert.isTrue(table.name.equals(tableName))
        })

        test('loads table using string', function () {
            const contract = getContract()
            const tableName = contract.tableNames[0]
            const table = contract.table(tableName)
            assert.instanceOf(table, Table)
            assert.isTrue(table.name.equals(tableName))
        })

        test('throws on invalid name', function () {
            const contract = getContract()
            assert.throws(() => contract.table('foo'))
        })
    })

    suite('actionNames', function () {
        test('contains actions', function () {
            const contract = getContract()
            assert.isArray(contract.actionNames)
            assert.isTrue(contract.actionNames.length > 0)
        })
    })

    suite('action', function () {
        test('loads action using Name', function () {
            const contract = getContract()
            const actionName = Name.from(contract.actionNames[0])
            const action = contract.action(actionName, getMockParams(contract))
            assert.instanceOf(action, Action)
            assert.isTrue(action.name.equals(actionName))
        })

        test('loads action using string', function () {
            const contract = getContract()
            const actionName = contract.actionNames[0]
            const action = contract.action(actionName, getMockParams(contract))
            assert.instanceOf(action, Action)
            assert.isTrue(action.name.equals(actionName))
        })

        test('throws on invalid name', function () {
            const contract = getContract()
            assert.throws(() => contract.action('foo', {}))
        })
    })
}
