import {ABI, ABIDef, API, APIClient, Name} from '@wharfkit/antelope'

/** Mashup of valid types for an APIClient call to v1.chain.get_table_rows */
export type TableRowParamsTypes =
    | API.v1.GetTableRowsParams
    | API.v1.GetTableRowsParamsKeyed
    | API.v1.GetTableRowsParamsTyped

export interface TableCursorArgs {
    /** The ABI for the contract this table belongs to */
    abi: ABIDef
    /** The APIClient instance to use for API requests */
    client: APIClient
    /** The parameters used for the v1/chain/get_table_rows call */
    params: TableRowParamsTypes
    /** The maximum number of rows the cursor should retrieve */
    maxRows?: number
}

/** The default parameters to use on a v1/chain/get_table_rows call */
const defaultParams = {
    json: false,
    limit: 1000,
}

export abstract class TableCursor<RowType = any> {
    /** The ABI for the contract this table belongs to */
    readonly abi: ABI
    /** The type of the table, as defined in the ABI */
    readonly type: string
    /** The parameters used for the v1/chain/get_table_rows call */
    readonly params: TableRowParamsTypes
    /** The APIClient instance to use for API requests */
    readonly client: APIClient

    /** For iterating on the cursor, the next key to query against lower_bounds */
    protected next_key: API.v1.TableIndexType | string | undefined
    /** Whether or not the cursor believes it has reached the end of its results */
    protected endReached = false
    /** The number of rows the cursor has retrieved */
    protected rowsCount = 0
    /** The maximum number of rows the cursor should retrieve */
    protected maxRows: number = Number.MAX_SAFE_INTEGER

    /**
     * Create a new TableCursor instance.
     *
     * @param args.abi The ABI for the contract.
     * @param args.client The APIClient instance to use for API requests.
     * @param args.params The parameters to use for the table query.
     * @param args.maxRows The maximum number of rows to fetch.
     * @returns A new TableCursor instance.
     */
    constructor(args: TableCursorArgs) {
        this.abi = ABI.from(args.abi)
        this.client = args.client
        this.params = {
            ...defaultParams,
            ...args.params,
        }
        if (args.maxRows) {
            this.maxRows = args.maxRows
        }
        const table = this.abi.tables.find((t) => Name.from(t.name).equals(this.params.table))
        if (!table) {
            throw new Error('Table not found')
        }
        this.type = table.type
    }

    /**
     * Implements the async iterator protocol for the cursor.
     *
     * @returns An iterator for all rows in the table.
     */
    async *[Symbol.asyncIterator]() {
        while (true) {
            const rows = await this.next()

            for (const row of rows) {
                yield row
            }

            if (rows.length === 0 || !this.next_key) {
                return
            }
        }
    }

    /**
     * Fetch the next batch of rows from the cursor.
     *
     * @param rowsPerAPIRequest The number of rows to fetch per API request.
     * @returns A promise containing the next batch of rows.
     */
    abstract next(rowsPerAPIRequest?: number): Promise<RowType[]>

    /**
     * Reset the internal state of the cursor
     */
    async reset() {
        this.next_key = undefined
        this.endReached = false
        this.rowsCount = 0
    }

    /**
     * Fetch all rows from the cursor by recursively calling next() until the end is reached.
     *
     * @returns A promise containing all rows for the cursor.
     */
    async all(): Promise<RowType[]> {
        const rows: RowType[] = []
        for await (const row of this) {
            rows.push(row)
        }
        return rows
    }
}
