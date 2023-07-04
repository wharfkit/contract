import {assert} from 'chai'

import {
    Contract as BaseContract,
    GetTableRowsOptions,
    QueryParams,
    Table,
    TableCursor,
} from '@wharfkit/contract'
import {
    ABI,
    ABISerializableObject,
    APIClient,
    Asset,
    AssetType,
    Name,
    NameType,
    Serializer,
    Session,
    Struct,
    TransactResult,
} from '@wharfkit/session'
import {makeClient, mockSession} from '@wharfkit/mock-data'

const client = makeClient('https://jungle4.greymass.com')

suite('classgen', function () {
    suite('class', function () {
        suite('constructor', function () {
            test('w/ client', async function () {
                assert.doesNotThrow(() => new Generated.Contract(client))
            })
            test('w/ session', async function () {
                assert.doesNotThrow(() => new Generated.Contract(mockSession))
            })
        })
        suite('accessing', function () {
            test('abi', async function () {
                const contract = new Generated.Contract(client)
                assert.instanceOf(contract.abi, ABI)
                assert.isDefined(contract.abi)
                if (contract.abi) {
                    assert.isTrue(contract.abi.equals(Generated.abi))
                }
            })
            test('account', async function () {
                const contract = new Generated.Contract(client)
                assert.instanceOf(contract.account, Name)
                assert.isDefined(contract.account)
                assert.isTrue(contract.account.equals('eosio.token'))
            })
            test('tables', async function () {
                const contract = new Generated.Contract(client)
                const cursor = contract.tables.accounts.first(1)
                assert.instanceOf(cursor, TableCursor)
                const rows = await cursor.next()
                assert.lengthOf(rows, 1)
                assert.instanceOf(rows[0], Generated.Types.Account)
                assert.instanceOf(rows[0].balance, Asset)
            })
        })
    })
    suite('static', function () {
        suite('accessing', function () {
            test('abi', function () {
                assert.instanceOf(Generated.abi, ABI)
                assert.isDefined(Generated.abi)
                if (Generated.abi) {
                    assert.isTrue(Generated.abi.equals(Generated.abi))
                }
            })
            test('account', async function () {
                assert.instanceOf(Generated.name, Name)
                assert.isDefined(Generated.name)
                assert.isTrue(Generated.name.equals('eosio.token'))
            })
            test('tables', async function () {
                const cursor = Generated.Tables.Accounts.first(1, client)
                assert.instanceOf(cursor, TableCursor)
                const rows = await cursor.next()
                console.log(rows)
                assert.lengthOf(rows, 1)
                assert.instanceOf(rows[0], Generated.Types.Account)
                assert.instanceOf(rows[0].balance, Asset)
            })
        })
    })
    suite('encoding', function () {
        test('raw -> abi', async function () {
            const test: ABI = Serializer.decode({data: Generated.encoded, type: ABI})
            assert.equal(test.version, 'eosio::abi/1.1')
            assert.isTrue(test.equals(Generated.abi))
        })
        test('abi -> raw', async function () {
            const test = String(Serializer.encode({object: Generated.abi, type: ABI}))
            assert.equal(Generated.encoded, test)
        })
    })
})

// This would be included in the contract kit
export abstract class AbstractTable<
    WhereQuery extends QueryParams = QueryParams,
    FindQuery extends QueryParams = QueryParams,
    RowType extends ABISerializableObject = ABISerializableObject
> {
    readonly contract: BaseContract
    readonly table: Table

    readonly tableType: string

    abstract fieldToIndex: {[key: string]: {type: string; index_position: string}}

    constructor(contract, namespace, tableType: string, rowType: string) {
        this.contract = contract
        this.tableType = tableType
        this.table = Table.from({
            name: namespace.Tables[tableType].tableName,
            rowType: namespace.Types[rowType],
            fieldToIndex: namespace.Tables[tableType].fieldToIndex,
            contract,
        })
    }

    public where = (
        queryParams: WhereQuery,
        getTableRowsOptions: GetTableRowsOptions
    ): TableCursor => this.table.where(queryParams, getTableRowsOptions)
    public find = (queryParams: FindQuery): Promise<RowType> => this.table.find(queryParams)
    public first = (limit: number): TableCursor => this.table.first(limit)
    public cursor = (): TableCursor => this.table.cursor()
    public all = (): Promise<ABISerializableObject[]> => this.table.all()
}

// This would be the generated code
export namespace Generated {
    export namespace Tables {
        export class Accounts extends AbstractTable<
            Types.AccountsFindQueryParams,
            Types.AccountsWhereQueryParams,
            Types.Account
        > {
            // The only fields required for the class-based implementation, rest from AbstractTable
            readonly tableName = Name.from('accounts')
            readonly fieldToIndex = {balance: {type: 'balance', index_position: 'primary'}}

            // All the properties/functions required by the namespace-based implementation
            static readonly tableName = Name.from('accounts')
            static readonly fieldToIndex = {balance: {type: 'balance', index_position: 'primary'}}

            public static where = (
                queryParams: Types.AccountsWhereQueryParams,
                getTableRowsOptions: GetTableRowsOptions,
                client: APIClient
            ): TableCursor => this.getTable(client).where(queryParams, getTableRowsOptions)

            public static find = (
                queryParams: Types.AccountsFindQueryParams,
                client: APIClient
            ): Promise<Types.Account> => this.getTable(client).find(queryParams)

            public static first = (limit: number, client: APIClient): TableCursor =>
                this.getTable(client).first(limit)

            public static cursor = (client: APIClient): TableCursor =>
                this.getTable(client).cursor()

            public static all = (client: APIClient): Promise<Types.Account[]> =>
                this.getTable(client).all()

            public static getTable(client) {
                return Table.from({
                    name: Tables.Accounts.tableName,
                    rowType: Types.Account,
                    fieldToIndex: Tables.Accounts.fieldToIndex,
                    contract: new Generated.Contract(client),
                })
            }
        }
    }

    export const encoded =
        '0e656f73696f3a3a6162692f312e310008076163636f756e7400010762616c616e636505617373657405636c6f73650002056f776e6572046e616d650673796d626f6c0673796d626f6c06637265617465000206697373756572046e616d650e6d6178696d756d5f737570706c790561737365740e63757272656e63795f7374617473000306737570706c790561737365740a6d61785f737570706c7905617373657406697373756572046e616d65056973737565000302746f046e616d65087175616e74697479056173736574046d656d6f06737472696e67046f70656e0003056f776e6572046e616d650673796d626f6c0673796d626f6c0972616d5f7061796572046e616d65067265746972650002087175616e74697479056173736574046d656d6f06737472696e67087472616e7366657200040466726f6d046e616d6502746f046e616d65087175616e74697479056173736574046d656d6f06737472696e6706000000000085694405636c6f7365ed032d2d2d0a737065635f76657273696f6e3a2022302e322e30220a7469746c653a20436c6f736520546f6b656e2042616c616e63650a73756d6d6172793a2027436c6f7365207b7b6e6f77726170206f776e65727d7de2809973207a65726f207175616e746974792062616c616e6365270a69636f6e3a2068747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f63727970746f6b796c696e2f656f73696f2e636f6e7472616374732f76312e372e302f636f6e7472616374732f69636f6e732f746f6b656e2e706e6723323037666636386230343036656161353636313862303862646138316436613039353435343366333661646333323861623330363566333161356335643635340a2d2d2d0a0a7b7b6f776e65727d7d2061677265657320746f20636c6f7365207468656972207a65726f207175616e746974792062616c616e636520666f7220746865207b7b73796d626f6c5f746f5f73796d626f6c5f636f64652073796d626f6c7d7d20746f6b656e2e0a0a52414d2077696c6c20626520726566756e64656420746f207468652052414d207061796572206f6620746865207b7b73796d626f6c5f746f5f73796d626f6c5f636f64652073796d626f6c7d7d20746f6b656e2062616c616e636520666f72207b7b6f776e65727d7d2e00000000a86cd445066372656174658e052d2d2d0a737065635f76657273696f6e3a2022302e322e30220a7469746c653a20437265617465204e657720546f6b656e0a73756d6d6172793a20274372656174652061206e657720746f6b656e270a69636f6e3a2068747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f63727970746f6b796c696e2f656f73696f2e636f6e7472616374732f76312e372e302f636f6e7472616374732f69636f6e732f746f6b656e2e706e6723323037666636386230343036656161353636313862303862646138316436613039353435343366333661646333323861623330363566333161356335643635340a2d2d2d0a0a7b7b24616374696f6e2e6163636f756e747d7d2061677265657320746f206372656174652061206e657720746f6b656e20776974682073796d626f6c207b7b61737365745f746f5f73796d626f6c5f636f6465206d6178696d756d5f737570706c797d7d20746f206265206d616e61676564206279207b7b6973737565727d7d2e0a0a5468697320616374696f6e2077696c6c206e6f7420726573756c7420616e7920616e7920746f6b656e73206265696e672069737375656420696e746f2063697263756c6174696f6e2e0a0a7b7b6973737565727d7d2077696c6c20626520616c6c6f77656420746f20697373756520746f6b656e7320696e746f2063697263756c6174696f6e2c20757020746f2061206d6178696d756d20737570706c79206f66207b7b6d6178696d756d5f737570706c797d7d2e0a0a52414d2077696c6c2064656475637465642066726f6d207b7b24616374696f6e2e6163636f756e747d7de2809973207265736f757263657320746f2063726561746520746865206e6563657373617279207265636f7264732e0000000000a53176056973737565e2072d2d2d0a737065635f76657273696f6e3a2022302e322e30220a7469746c653a20497373756520546f6b656e7320696e746f2043697263756c6174696f6e0a73756d6d6172793a20274973737565207b7b6e6f77726170207175616e746974797d7d20696e746f2063697263756c6174696f6e20616e64207472616e7366657220696e746f207b7b6e6f7772617020746f7d7de2809973206163636f756e74270a69636f6e3a2068747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f63727970746f6b796c696e2f656f73696f2e636f6e7472616374732f76312e372e302f636f6e7472616374732f69636f6e732f746f6b656e2e706e6723323037666636386230343036656161353636313862303862646138316436613039353435343366333661646333323861623330363566333161356335643635340a2d2d2d0a0a54686520746f6b656e206d616e616765722061677265657320746f206973737565207b7b7175616e746974797d7d20696e746f2063697263756c6174696f6e2c20616e64207472616e7366657220697420696e746f207b7b746f7d7de2809973206163636f756e742e0a0a7b7b236966206d656d6f7d7d54686572652069732061206d656d6f20617474616368656420746f20746865207472616e736665722073746174696e673a0a7b7b6d656d6f7d7d0a7b7b2f69667d7d0a0a4966207b7b746f7d7d20646f6573206e6f74206861766520612062616c616e636520666f72207b7b61737365745f746f5f73796d626f6c5f636f6465207175616e746974797d7d2c206f722074686520746f6b656e206d616e6167657220646f6573206e6f74206861766520612062616c616e636520666f72207b7b61737365745f746f5f73796d626f6c5f636f6465207175616e746974797d7d2c2074686520746f6b656e206d616e616765722077696c6c2062652064657369676e61746564206173207468652052414d207061796572206f6620746865207b7b61737365745f746f5f73796d626f6c5f636f6465207175616e746974797d7d20746f6b656e2062616c616e636520666f72207b7b746f7d7d2e204173206120726573756c742c2052414d2077696c6c2062652064656475637465642066726f6d2074686520746f6b656e206d616e61676572e2809973207265736f757263657320746f2063726561746520746865206e6563657373617279207265636f7264732e0a0a5468697320616374696f6e20646f6573206e6f7420616c6c6f772074686520746f74616c207175616e7469747920746f2065786365656420746865206d617820616c6c6f77656420737570706c79206f662074686520746f6b656e2e00000000003055a5046f70656eba052d2d2d0a737065635f76657273696f6e3a2022302e322e30220a7469746c653a204f70656e20546f6b656e2042616c616e63650a73756d6d6172793a20274f70656e2061207a65726f207175616e746974792062616c616e636520666f72207b7b6e6f77726170206f776e65727d7d270a69636f6e3a2068747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f63727970746f6b796c696e2f656f73696f2e636f6e7472616374732f76312e372e302f636f6e7472616374732f69636f6e732f746f6b656e2e706e6723323037666636386230343036656161353636313862303862646138316436613039353435343366333661646333323861623330363566333161356335643635340a2d2d2d0a0a7b7b72616d5f70617965727d7d2061677265657320746f2065737461626c6973682061207a65726f207175616e746974792062616c616e636520666f72207b7b6f776e65727d7d20666f7220746865207b7b73796d626f6c5f746f5f73796d626f6c5f636f64652073796d626f6c7d7d20746f6b656e2e0a0a4966207b7b6f776e65727d7d20646f6573206e6f74206861766520612062616c616e636520666f72207b7b73796d626f6c5f746f5f73796d626f6c5f636f64652073796d626f6c7d7d2c207b7b72616d5f70617965727d7d2077696c6c2062652064657369676e61746564206173207468652052414d207061796572206f6620746865207b7b73796d626f6c5f746f5f73796d626f6c5f636f64652073796d626f6c7d7d20746f6b656e2062616c616e636520666f72207b7b6f776e65727d7d2e204173206120726573756c742c2052414d2077696c6c2062652064656475637465642066726f6d207b7b72616d5f70617965727d7de2809973207265736f757263657320746f2063726561746520746865206e6563657373617279207265636f7264732e00000000a8ebb2ba06726574697265d0032d2d2d0a737065635f76657273696f6e3a2022302e322e30220a7469746c653a2052656d6f766520546f6b656e732066726f6d2043697263756c6174696f6e0a73756d6d6172793a202752656d6f7665207b7b6e6f77726170207175616e746974797d7d2066726f6d2063697263756c6174696f6e270a69636f6e3a2068747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f63727970746f6b796c696e2f656f73696f2e636f6e7472616374732f76312e372e302f636f6e7472616374732f69636f6e732f746f6b656e2e706e6723323037666636386230343036656161353636313862303862646138316436613039353435343366333661646333323861623330363566333161356335643635340a2d2d2d0a0a54686520746f6b656e206d616e616765722061677265657320746f2072656d6f7665207b7b7175616e746974797d7d2066726f6d2063697263756c6174696f6e2c2074616b656e2066726f6d207468656972206f776e206163636f756e742e0a0a7b7b236966206d656d6f7d7d2054686572652069732061206d656d6f20617474616368656420746f2074686520616374696f6e2073746174696e673a0a7b7b6d656d6f7d7d0a7b7b2f69667d7d000000572d3ccdcd087472616e73666572aa072d2d2d0a737065635f76657273696f6e3a2022302e322e30220a7469746c653a205472616e7366657220546f6b656e730a73756d6d6172793a202753656e64207b7b6e6f77726170207175616e746974797d7d2066726f6d207b7b6e6f777261702066726f6d7d7d20746f207b7b6e6f7772617020746f7d7d270a69636f6e3a2068747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f63727970746f6b796c696e2f656f73696f2e636f6e7472616374732f76312e372e302f636f6e7472616374732f69636f6e732f7472616e736665722e706e6723356466616430646637323737326565316363633135356536373063316431323466356335313232663164353032373536356466333862343138303432643164640a2d2d2d0a0a7b7b66726f6d7d7d2061677265657320746f2073656e64207b7b7175616e746974797d7d20746f207b7b746f7d7d2e0a0a7b7b236966206d656d6f7d7d54686572652069732061206d656d6f20617474616368656420746f20746865207472616e736665722073746174696e673a0a7b7b6d656d6f7d7d0a7b7b2f69667d7d0a0a4966207b7b66726f6d7d7d206973206e6f7420616c7265616479207468652052414d207061796572206f66207468656972207b7b61737365745f746f5f73796d626f6c5f636f6465207175616e746974797d7d20746f6b656e2062616c616e63652c207b7b66726f6d7d7d2077696c6c2062652064657369676e6174656420617320737563682e204173206120726573756c742c2052414d2077696c6c2062652064656475637465642066726f6d207b7b66726f6d7d7de2809973207265736f757263657320746f20726566756e6420746865206f726967696e616c2052414d2070617965722e0a0a4966207b7b746f7d7d20646f6573206e6f74206861766520612062616c616e636520666f72207b7b61737365745f746f5f73796d626f6c5f636f6465207175616e746974797d7d2c207b7b66726f6d7d7d2077696c6c2062652064657369676e61746564206173207468652052414d207061796572206f6620746865207b7b61737365745f746f5f73796d626f6c5f636f6465207175616e746974797d7d20746f6b656e2062616c616e636520666f72207b7b746f7d7d2e204173206120726573756c742c2052414d2077696c6c2062652064656475637465642066726f6d207b7b66726f6d7d7de2809973207265736f757263657320746f2063726561746520746865206e6563657373617279207265636f7264732e02000000384f4d1132036936340000076163636f756e740000000000904dc60369363400000e63757272656e63795f737461747300000000'

    export const abi = Serializer.decode({data: encoded, type: ABI})

    export const name = Name.from('eosio.token')

    export class Contract extends BaseContract {
        // public actions = TokenContract.actions
        public types = Types

        public tables = {
            accounts: new Tables.Accounts(this, Generated, 'Accounts', 'Account'),
        }

        constructor(provider: APIClient | Session) {
            let client
            if (provider instanceof APIClient) {
                client = provider
            }
            if (provider instanceof Session) {
                client = provider.client
            }
            super({
                abi: Generated.abi,
                client,
                name: Generated.name,
            })
        }
    }

    export namespace Actions {
        export function close(
            closeParams: Types.CloseParams,
            session: Session
        ): Promise<TransactResult> {
            const contract = Contract.from({name: 'eosio.token'})
            return contract.call('close', Types.Close.from(closeParams), session)
        }
        export function create(
            createParams: Types.CreateParams,
            session: Session
        ): Promise<TransactResult> {
            const contract = Contract.from({name: 'eosio.token'})
            return contract.call('create', Types.Create.from(createParams), session)
        }
        export function issue(
            issueParams: Types.IssueParams,
            session: Session
        ): Promise<TransactResult> {
            const contract = Contract.from({name: 'eosio.token'})
            return contract.call('issue', Types.Issue.from(issueParams), session)
        }
        export function open(
            openParams: Types.OpenParams,
            session: Session
        ): Promise<TransactResult> {
            const contract = Contract.from({name: 'eosio.token'})
            return contract.call('open', Types.Open.from(openParams), session)
        }
        export function retire(
            retireParams: Types.RetireParams,
            session: Session
        ): Promise<TransactResult> {
            const contract = Contract.from({name: 'eosio.token'})
            return contract.call('retire', Types.Retire.from(retireParams), session)
        }
        export function transfer(
            transferParams: Types.TransferParams,
            session: Session
        ): Promise<TransactResult> {
            const contract = Contract.from({name: 'eosio.token'})
            return contract.call('transfer', Types.Transfer.from(transferParams), session)
        }
    }

    export namespace Types {
        export interface CloseParams {
            owner: NameType
            symbol: symbol
        }
        export interface CreateParams {
            issuer: NameType
            maximum_supply: AssetType
        }
        export interface IssueParams {
            to: NameType
            quantity: AssetType
            memo: string
        }
        export interface OpenParams {
            owner: NameType
            symbol: symbol
            ram_payer: NameType
        }
        export interface RetireParams {
            quantity: AssetType
            memo: string
        }
        export interface TransferParams {
            from: NameType
            to: NameType
            quantity: AssetType
            memo: string
        }
        export interface AccountsWhereQueryParams extends QueryParams {
            balance?: {
                from: AssetType
                to: AssetType
            }
        }
        export interface AccountsFindQueryParams extends QueryParams {
            balance?: AssetType
        }
        export interface StatWhereQueryParams {
            supply?: {
                from: AssetType
                to: AssetType
            }
            max_supply?: {
                from: AssetType
                to: AssetType
            }
            issuer?: {
                from: NameType
                to: NameType
            }
        }
        export interface StatFindQueryParams {
            supply?: AssetType
            max_supply?: AssetType
            issuer?: NameType
        }
        @Struct.type('account')
        export class Account extends Struct {
            @Struct.field('asset')
            declare balance: Asset
        }
        @Struct.type('close')
        export class Close extends Struct {
            @Struct.field('name')
            declare owner: Name
            @Struct.field('symbol')
            declare symbol: symbol
        }
        @Struct.type('create')
        export class Create extends Struct {
            @Struct.field('name')
            declare issuer: Name
            @Struct.field('asset')
            declare maximum_supply: Asset
        }
        @Struct.type('currency_stats')
        export class Currency_stats extends Struct {
            @Struct.field('asset')
            declare supply: Asset
            @Struct.field('asset')
            declare max_supply: Asset
            @Struct.field('name')
            declare issuer: Name
        }
        @Struct.type('issue')
        export class Issue extends Struct {
            @Struct.field('name')
            declare to: Name
            @Struct.field('asset')
            declare quantity: Asset
            @Struct.field('string')
            declare memo: string
        }
        @Struct.type('open')
        export class Open extends Struct {
            @Struct.field('name')
            declare owner: Name
            @Struct.field('symbol')
            declare symbol: symbol
            @Struct.field('name')
            declare ram_payer: Name
        }
        @Struct.type('retire')
        export class Retire extends Struct {
            @Struct.field('asset')
            declare quantity: Asset
            @Struct.field('string')
            declare memo: string
        }
        @Struct.type('transfer')
        export class Transfer extends Struct {
            @Struct.field('name')
            declare from: Name
            @Struct.field('name')
            declare to: Name
            @Struct.field('asset')
            declare quantity: Asset
            @Struct.field('string')
            declare memo: string
        }
    }
}
