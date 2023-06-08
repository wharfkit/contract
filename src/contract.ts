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
    name?: NameType
    client?: APIClient
}

export class Contract {
    private static _shared: Contract | null = null
    private static account: Name

    private abi?: ABI.Def

    /** Account where contract is deployed. */
    readonly account: Name
    readonly client?: APIClient

    constructor(options?: ContractOptions) {
        if ((this.constructor as typeof Contract).account) {
            if (options?.name) {
                throw new Error('Cannot specify account when using subclassed Contract')
            }
            this.account = Name.from((this.constructor as any).account!)
        } else {
            if (!options?.name) {
                throw new Error('Must specify account when using Contract directly')
            }
            this.account = Name.from(options?.name)
        }

        if (options?.client) {
            this.client = options.client
        }
    }

    static from(options?: ContractOptions): Contract {
        return new this(options)
    }

    /** Shared instance of the contract. */
    static shared<T extends {new ()}>(this: T): InstanceType<T> {
        const self = this as unknown as typeof Contract
        if (!self._shared) {
            self._shared = new self()
        }
        return self._shared as InstanceType<T>
    }

    /** Call a contract action. */
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

    /** get all tables */
    async getTables(): Promise<Table[]> {
        const abi = await this.getAbi()

        return abi.tables.map((table) => {
            return new Table({
                contract: this.account,
                name: table.name,
                client: this.client!,
            })
        })
    }

    async getTable(name: NameType): Promise<Table> {
        const tables = await this.getTables()

        const table = tables.find((table) => table.name.equals(name))

        if (!table) {
            throw new Error(`No table found with name ${name}`)
        }

        return table
    }

    async getAbi(): Promise<ABI.Def> {
        if (this.abi) {
            return this.abi
        }

        if (!this.client) {
            throw new Error('Cannot get ABI without client')
        }

        const {abi} = await this.client.v1.chain.get_abi(this.account)

        if (!abi) {
            throw new Error(`No ABI found for ${this.account}`)
        }

        this.abi = abi

        return abi
    }
}
