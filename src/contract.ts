import {
    ABI,
    ABIDef,
    ABISerializableObject,
    Action,
    APIClient,
    Name,
    NameType,
    Session,
    TransactResult,
} from '@wharfkit/session'

import {Table} from './contract/table'
import {BytesType, PermissionLevel, PermissionLevelType, PlaceholderAuth} from '@wharfkit/session'

export type ActionDataType = BytesType | ABISerializableObject | Record<string, any>

export interface ContractArgs {
    abi: ABIDef
    account: NameType
    client: APIClient
}

export interface ContractOptions {
    session?: Session
}

export interface CallOptions {
    session?: Session
}

export interface ActionArgs {
    name: NameType
    data: ActionDataType
    authorization?: PermissionLevelType[]
}

export interface ActionOptions {
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
    readonly session?: Session

    /**
     * Constructs a new `Contract` instance.
     *
     * @param {ContractArgs} args - The required arguments for a contract.
     * @param {ContractOptions} options - The options for the contract.
     */
    constructor(args: ContractArgs, options: ContractOptions = {}) {
        this.abi = ABI.from(args.abi)
        this.account = Name.from(args.account)
        this.client = args.client

        if (options.session) {
            this.session = options.session
        }
    }

    public get tableNames(): string[] {
        return this.abi.tables.map((table) => String(table.name))
    }

    public table(name: NameType) {
        if (!this.tables.includes(String(name))) {
            throw new Error(`Contract (${this.account}) does not have a table named (${name})`)
        }
        return Table.from({
            contract: this,
            name,
        })
    }

    public get actionNames(): string[] {
        return this.abi.actions.map((action) => String(action.name))
    }

    public hasAction(name: NameType): boolean {
        return this.actionNames.includes(String(name))
    }

    public action(name: NameType, data: ActionDataType, options?: ActionOptions): Action {
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

    public actions(actions: ActionArgs[], options?: ActionOptions): Action[] {
        return actions.map((action) =>
            this.action(action.name, action.data, {
                authorization: action.authorization || options?.authorization,
            })
        )
    }

    public async call(
        name: NameType,
        data: ActionDataType,
        options?: CallOptions
    ): Promise<TransactResult> {
        const session = options ? options.session : this.session
        if (!session) {
            throw new Error(`Cannot call action (${this.account}::${name}) without a Session.`)
        }

        return session.transact(
            {
                action: this.action(name, data),
            },
            {
                abis: [
                    {
                        account: this.account,
                        abi: this.abi,
                    },
                ],
            }
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
