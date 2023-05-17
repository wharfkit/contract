import {ABISerializableObject, Action, Name, Session} from '@wharfkit/session'
import type {NameType, TransactOptions, TransactResult, BytesType} from '@wharfkit/session'

export interface ContractOptions {
    account?: NameType
}

export class Contract {
    private static _shared: Contract | null = null
    private static account: Name

    /** Account where contract is deployed. */
    readonly account: Name

    constructor(options?: ContractOptions) {
        if ((this.constructor as typeof Contract).account) {
            if (options?.account) {
                throw new Error('Cannot specify account when using subclassed Contract')
            }
            this.account = Name.from((this.constructor as typeof Contract).account!)
        } else {
            if (!options?.account) {
                throw new Error('Must specify account when using Contract directly')
            }
            this.account = Name.from(options?.account)
        }
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
        data: BytesType | ABISerializableObject | Record<string, any>,
        session: Session,
        transactOptions?: TransactOptions
    ): Promise<TransactResult> {
        const action: Action = Action.from({
            account: this.account,
            name,
            authorization: [session.permissionLevel],
            data,
        })

        // Trigger the transaction using the session kit
        return session.transact({action}, transactOptions)
    }

    async getTableRows(table: string, options: GetTableRowsOptions = {}): Promise<TableCursor> {
        if (!this.client) {
            throw Error(
                'A client instance must be passed to the contract instance in order to use this method.'
            )
        }

        const scope = this.account
        const json = options.json ?? true
        const start = options.start || null
        const end = options.end || null
        const limit = options.limit || 100
        const index_position = options.keyType

        const {rows, next_key} = await this.client.v1.chain.get_table_rows({
            json,
            code: this.account,
            scope,
            table,
            lower_bound: start ? UInt64.from(start) : undefined,
            upper_bound: end ? UInt64.from(end) : undefined,
            limit,
            index_position,
        })

        return new TableCursor(rows, () => {
            // const lastRow = response.rows[response.rows.length - 1]

            this.getTableRows(table, {
                ...options,
                start: next_key,
            })
        })
    }
}

interface TableRow {}

export class TableCursor {
    private rows: TableRow[]
    private currentIndex: number

    constructor(rows, more) {
        this.rows = rows
        this.more = more
        this.currentIndex = 0
    }

    // Allows for iteration through rows
    [Symbol.iterator]() {
        return {
            next: () => {
                if (this.currentIndex < this.rows.length) {
                    return {value: this.rows[this.currentIndex++], done: false}
                } else {
                    return {done: true}
                }
            },
        }
    }

    // Fetches more rows
    async more() {
        if (this.more) {
            // Here you should implement code to fetch next batch of rows from the server
            // This is just a simplified example without actual server call
            const response = await this.more() // fetchNextBatch is a hypothetical function
            this.rows = this.rows.concat(response.rows)
            this.more = response.more
            this.currentIndex = 0
        }
        return this
    }
}
