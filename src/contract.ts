import {
    ABI,
    ABISerializableObject,
    Action,
    Name,
    NameType,
    Session,
    TransactResult,
} from '@wharfkit/session'
import type {APIClient} from '@wharfkit/session'
import {Table} from './contract/table'

export interface ContractOptions {
    name: NameType
    client?: APIClient
    abi?: ABI.Def
}

/**
 * Represents a smart contract in the blockchain.
 * Provides methods for interacting with the contract such as
 * calling actions, reading tables, and getting the ABI of the contract.
 */
export class Contract {
    private static _shared: Contract | null = null
    private static account: Name

    private abi?: ABI.Def

    readonly account: Name
    readonly client?: APIClient

    /**
     * Constructs a new `Contract` instance.
     *
     * @param {ContractOptions} options - The options for the contract.
     * @param {NameType} options.name - The name of the contract.
     * @param {APIClient} options.client - The client to connect to the blockchain.
     */
    constructor(options: ContractOptions) {
        this.account = Name.from(options.name)

        this.client = options.client

        this.abi = options.abi
    }

    /**
     * Creates a new `Contract` instance with the given options.
     *
     * @param {ContractOptions} options - The options for the contract.
     * @return {Contract} A new contract instance.
     */
    static from(options: ContractOptions): Contract {
        return new this(options)
    }

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
        return session.transact(
            {action},
            {
                abis: [
                    {
                        account: this.account,
                        abi: this.abi || (await this.getAbi()),
                    },
                ],
            }
        )
    }

    /**
     * Gets all the tables for the contract.
     *
     * @return {Promise<Table[]>} A promise that resolves with all the tables for the contract.
     */
    async getTables(): Promise<Table[]> {
        const abi = await this.getAbi()

        return abi.tables.map((table) => {
            return new Table({
                contract: this,
                name: table.name,
            })
        })
    }

    /**
     * Gets a specific table for the contract.
     *
     * @param {NameType} name - The name of the table.
     * @return {Promise<Table>} A promise that resolves with the specified table.
     */
    async getTable(name: NameType): Promise<Table> {
        const tables = await this.getTables()

        const table = tables.find((table) => table.name.equals(name))

        if (!table) {
            throw new Error(`No table found with name ${name}`)
        }

        return table
    }

    /**
     * Gets the ABI for the contract.
     *
     * @return {Promise<ABI.Def>} A promise that resolves with the ABI for the contract.
     */
    async getAbi(): Promise<ABI.Def> {
        if (this.abi) {
            return this.abi
        }

        if (!this.client) {
            throw new Error('Cannot get ABI without client')
        }

        let response

        try {
            response = await this.client.v1.chain.get_abi(this.account)
        } catch (error: any) {
            if (error.message.includes('Account not found')) {
                throw new Error(`No ABI found for ${this.account}`)
            } else {
                throw new Error(`Error fetching ABI: ${JSON.stringify(error)}`)
            }
        }

        const {abi} = response

        this.abi = abi

        return abi
    }
}
