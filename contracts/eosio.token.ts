import {Contract} from '../src/contract'
import {Struct, Name, NameType, Asset, AssetType, TransactResult} from '@wharfkit/session'
export class EosioToken extends Contract {
    close(owner: NameType, symbol: symbol): Promise<TransactResult> {
        return this.call('close', EosioToken.Types.Close.from({owner: owner, symbol: symbol}))
    }
    create(issuer: NameType, maximum_supply: AssetType): Promise<TransactResult> {
        return this.call(
            'create',
            EosioToken.Types.Create.from({issuer: issuer, maximum_supply: maximum_supply})
        )
    }
    issue(to: NameType, quantity: AssetType, memo: string): Promise<TransactResult> {
        return this.call(
            'issue',
            EosioToken.Types.Issue.from({to: to, quantity: quantity, memo: memo})
        )
    }
    open(owner: NameType, symbol: symbol, ram_payer: NameType): Promise<TransactResult> {
        return this.call(
            'open',
            EosioToken.Types.Open.from({owner: owner, symbol: symbol, ram_payer: ram_payer})
        )
    }
    retire(quantity: AssetType, memo: string): Promise<TransactResult> {
        return this.call('retire', EosioToken.Types.Retire.from({quantity: quantity, memo: memo}))
    }
    transfer(
        from: NameType,
        to: NameType,
        quantity: AssetType,
        memo: string
    ): Promise<TransactResult> {
        return this.call(
            'transfer',
            EosioToken.Types.Transfer.from({from: from, to: to, quantity: quantity, memo: memo})
        )
    }
}
export namespace EosioToken {
    export namespace Types {
        @Struct.type('account')
        export class Account extends Struct {
            @Struct.field('balance')
            declare balance: Asset
        }
        @Struct.type('close')
        export class Close extends Struct {
            @Struct.field('owner')
            declare owner: Name
            @Struct.field('symbol')
            declare symbol: Symbol
        }
        @Struct.type('create')
        export class Create extends Struct {
            @Struct.field('issuer')
            declare issuer: Name
            @Struct.field('maximum_supply')
            declare maximum_supply: Asset
        }
        @Struct.type('currency_stats')
        export class Currency_stats extends Struct {
            @Struct.field('supply')
            declare supply: Asset
            @Struct.field('max_supply')
            declare max_supply: Asset
            @Struct.field('issuer')
            declare issuer: Name
        }
        @Struct.type('issue')
        export class Issue extends Struct {
            @Struct.field('to')
            declare to: Name
            @Struct.field('quantity')
            declare quantity: Asset
            @Struct.field('memo')
            declare memo: String
        }
        @Struct.type('open')
        export class Open extends Struct {
            @Struct.field('owner')
            declare owner: Name
            @Struct.field('symbol')
            declare symbol: Symbol
            @Struct.field('ram_payer')
            declare ram_payer: Name
        }
        @Struct.type('retire')
        export class Retire extends Struct {
            @Struct.field('quantity')
            declare quantity: Asset
            @Struct.field('memo')
            declare memo: String
        }
        @Struct.type('transfer')
        export class Transfer extends Struct {
            @Struct.field('from')
            declare from: Name
            @Struct.field('to')
            declare to: Name
            @Struct.field('quantity')
            declare quantity: Asset
            @Struct.field('memo')
            declare memo: String
        }
    }
}

export default EosioToken
