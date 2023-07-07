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

export interface ContractArgs {
    abi: ABIDef
    account: NameType
    client: APIClient
}

export interface ContractOptions {
    session?: Session
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

    static from(args: ContractArgs, options: ContractOptions = {}): Contract {
        return new this(args, options)
    }

    get tables(): string[] {
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

    // TODO: reimplement call method
    /**
     * Calls a contract action.
     *
     * @param {NameType} name - The name of the action.
     * @param {ABISerializableObject | {[key: string]: any}} data - The data for the action.
     * @param {Session} session - The session object to use to sign the transaction.
     * @return {Promise<TransactResult>} A promise that resolves with the transaction data.
     */
    async call(
        name: NameType,
        data: ABISerializableObject | {[key: string]: any},
        session: Session
    ): Promise<TransactResult> {
        const action: Action = Action.from({
            account: this.account,
            name,
            authorization: [],
            data,
        })

        // Trigger the transaction using the session kit
        return session.transact({action})
    }
}
