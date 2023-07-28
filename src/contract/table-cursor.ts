import {ABI, ABIDef, API, APIClient, Serializer} from '@wharfkit/antelope'
import {wrapIndexValue} from '../utils'

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

export class TableCursor<RowType = any> {
    /** The ABI for the contract this table belongs to */
    readonly abi: ABI
    /** The type of the table, as defined in the ABI */
    readonly type: string
    /** The parameters used for the v1/chain/get_table_rows call */
    readonly params: TableRowParamsTypes
    /** The APIClient instance to use for API requests */
    readonly client: APIClient

    /** For iterating on the cursor, the next key to query against lower_bounds */
    private next_key: API.v1.TableIndexType | string | undefined
    /** Whether or not the cursor believes it has reached the end of its results */
    private endReached = false
    /** The number of rows the cursor has retrieved */
    private rowsCount = 0
    /** The maximum number of rows the cursor should retrieve */
    private maxRows: number = Number.MAX_SAFE_INTEGER

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
        const table = this.abi.tables.find((t) => t.name === String(this.params.table))
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
    async next(rowsPerAPIRequest: number = Number.MAX_SAFE_INTEGER): Promise<RowType[]> {
        // If the cursor has deemed its at the end, return an empty array
        if (this.endReached) {
            return []
        }

        // Set the lower_bound, and override if the cursor has a next_key value
        let lower_bound = this.params.lower_bound
        if (this.next_key) {
            lower_bound = this.next_key
        }

        // Determine the maximum number of remaining rows for the cursor
        const rowsRemaining = this.maxRows - this.rowsCount

        // Find the lowest amount between rows remaining, rows per request, or the provided query params limit
        const limit = Math.min(rowsRemaining, rowsPerAPIRequest, this.params.limit)

        // Assemble and perform the v1/chain/get_table_rows query
        const query = {
            ...this.params,
            limit,
            lower_bound: wrapIndexValue(lower_bound),
            upper_bound: wrapIndexValue(this.params.upper_bound),
        }

        const result = await this.client!.v1.chain.get_table_rows(query)

        // Determine if we need to decode the rows, based on if:
        // - json parameter is false, meaning hex data will be returned
        // - type parameter is not set, meaning the APIClient will not automatically decode
        const requiresDecoding =
            this.params.json === false && !(query as API.v1.GetTableRowsParamsTyped).type

        // Retrieve the rows from the result, decoding if needed
        const rows: RowType[] = requiresDecoding
            ? result.rows.map((data) =>
                  Serializer.decode({
                      data,
                      abi: this.abi,
                      type: this.type,
                  })
              )
            : result.rows

        // Persist cursor state for subsequent calls
        this.next_key = result.next_key
        this.rowsCount += rows.length

        // Determine if we've reached the end of the cursor
        if (!result.next_key || rows.length === 0 || this.rowsCount === this.maxRows) {
            this.endReached = true
        }

        return rows
    }

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
