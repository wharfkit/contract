import {
    ABI,
    ABIDef,
    ABISerializableObject,
    Action,
    APIClient,
    BytesType,
    Name,
    NameType,
    PermissionLevel,
    PermissionLevelType,
} from '@wharfkit/antelope'
import {PlaceholderAuth} from '@wharfkit/signing-request'

import {Table} from './contract/table'

export interface ContractArgs {
    abi: ABIDef
    account: NameType
    client: APIClient
}

export interface ActionOptions {
    authorization?: PermissionLevelType[]
}

export type ActionDataType = BytesType | ABISerializableObject | Record<string, any>

export type ActionConstructor = (data: ActionDataType, options?: ActionOptions) => Action

export interface ActionsArgs {
    name: NameType
    data: ActionDataType
    authorization?: PermissionLevelType[]
}

/**
 * Represents a smart contract deployed to a specific blockchain.
 * Provides methods for interacting with the contract such as
 * calling actions, reading tables, and getting the ABI of the contract.
 */
export class Contract {
    readonly abi: ABI
    readonly account: Name
    readonly client: APIClient

    /**
     * Constructs a new `Contract` instance.
     *
     * @param {ContractArgs} args - The required arguments for a contract.
     * @param {ContractOptions} options - The options for the contract.
     */
    constructor(args: ContractArgs) {
        if (!args.abi) {
            throw new Error('Contract requires an ABI')
        }
        this.abi = ABI.from(args.abi)
        if (!args.account) {
            throw new Error('Contract requires an account name')
        }
        this.account = Name.from(args.account)
        if (!args.client) {
            throw new Error('Contract requires an APIClient')
        }
        this.client = args.client
    }

    public get tableNames(): string[] {
        return this.abi.tables.map((table) => String(table.name))
    }

    public hasTable(name: NameType): boolean {
        return this.tableNames.includes(String(name))
    }

    public table<RowType = any>(name: NameType, scope?: NameType, rowType?): Table<RowType> {
        if (!this.hasTable(name)) {
            throw new Error(`Contract (${this.account}) does not have a table named (${name})`)
        }
        return Table.from<RowType>({
            abi: this.abi,
            account: this.account,
            client: this.client,
            defaultScope: scope,
            name,
            rowType,
        })
    }

    public get actionNames(): string[] {
        return this.abi.actions.map((action) => String(action.name))
    }

    public hasAction(name: NameType): boolean {
        return this.actionNames.includes(String(name))
    }

    public action(name, data: ActionDataType, options?: ActionOptions): Action {
        if (!this.hasAction(name)) {
            throw new Error(`Contract (${this.account}) does not have an action named (${name})`)
        }

        let authorization = [PlaceholderAuth]
        if (options && options.authorization) {
            authorization = options.authorization.map((auth) => PermissionLevel.from(auth))
        }
        return Action.from(
            {
                account: this.account,
                name,
                authorization,
                data,
            },
            this.abi
        )
    }

    public actions(actions: ActionsArgs[], options?: ActionOptions): Action[] {
        return actions.map((action) =>
            this.action(action.name, action.data, {
                authorization: action.authorization || options?.authorization,
            })
        )
    }

    public ricardian(name: NameType) {
        if (!this.hasAction(name)) {
            throw new Error(`Contract (${this.account}) does not have an action named (${name})`)
        }
        const action = this.abi.actions.find((action) => Name.from(action.name).equals(name))
        if (!action || !action.ricardian_contract) {
            throw new Error(
                `Contract (${this.account}) action named (${name}) does not have a defined ricardian contract`
            )
        }
        return action.ricardian_contract
    }
}
