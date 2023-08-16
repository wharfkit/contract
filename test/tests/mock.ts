import {assert} from 'chai'
import {Action, Asset, Bytes, Name, PermissionLevel, Serializer, Struct} from '@wharfkit/antelope'
import {makeClient} from '@wharfkit/mock-data'

import RewardsGm from '$test/data/contracts/mock-rewards'
import {PlaceholderName, PlaceholderPermission} from '@wharfkit/signing-request'
import {Table, TableRowCursor} from 'src/index-module'

const client = makeClient('https://eos.greymass.com')
const contract = new RewardsGm.Contract({client})

suite('functionality', function () {
    suite('Contract', function () {
        suite('retrieve action', function () {
            test('untyped', function () {
                const action = contract.action('claim', {
                    account: PlaceholderName,
                })
                assert.instanceOf(action, Action)
                assert.instanceOf(action.account, Name)
                assert.instanceOf(action.name, Name)
                assert.instanceOf(action.authorization[0], PermissionLevel)
                assert.instanceOf(action.data, Bytes)
                assert.isTrue(action.account.equals('rewards.gm'))
                assert.isTrue(action.name.equals('claim'))
                assert.isTrue(action.authorization[0].actor.equals(PlaceholderName))
                assert.isTrue(action.authorization[0].permission.equals(PlaceholderPermission))

                @Struct.type('claim')
                class Claim extends Struct {
                    @Struct.field(Name) account!: Name
                    @Struct.field(Asset, {optional: true}) amount?: Asset
                }
                const decoded = Serializer.decode({
                    data: action.data,
                    abi: contract.abi,
                    type: Claim,
                })
                assert.isTrue(decoded.account.equals(PlaceholderName))
                assert.isNull(decoded.amount)
            })
            test('typed values', function () {
                const action = contract.action('claim', {
                    account: Name.from('teamgreymass'),
                })
                assert.instanceOf(action, Action)
            })
            test('struct', function () {
                @Struct.type('claim')
                class Claim extends Struct {
                    @Struct.field(Name) account!: Name
                    @Struct.field(Asset, {optional: true}) amount?: Asset
                }
                const action = contract.action(
                    'claim',
                    Claim.from({
                        account: Name.from('teamgreymass'),
                    })
                )
                assert.instanceOf(action, Action)
            })
        })
        suite('retrieve table', function () {
            test('automatically typed', async function () {
                const table = contract.table('config')
                assert.instanceOf(table, Table)

                const config = await table.get()
                assert.instanceOf(config, RewardsGm.Types.Config)

                const cursor = await table.first(1)
                assert.instanceOf(cursor, TableRowCursor)
                const result = await cursor.next()
                assert.instanceOf(result[0], RewardsGm.Types.Config)

                const user = await contract.table('users').get()
                assert.instanceOf(user, RewardsGm.Types.UserRow)
            })
        })
    })
})
