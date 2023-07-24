import {ABI, ABIDef, API, APIClient, Serializer} from '@greymass/eosio'
import {wrapIndexValue} from '../utils'

type TableRowParamsTypes =
    | API.v1.GetTableRowsParams
    | API.v1.GetTableRowsParamsKeyed
    | API.v1.GetTableRowsParamsTyped

interface TableCursorArgs {
    abi: ABIDef
    client: APIClient
    params: TableRowParamsTypes
    maxRows?: number
}

const defaultParams = {
    json: false,
    limit: 1000,
}

export class TableCursor<RowType = any> {
    readonly abi: ABI
    readonly type: string
    readonly params: TableRowParamsTypes
    readonly client: APIClient

    private next_key: API.v1.TableIndexType | string | undefined

    private endReached = false
    private rowsCount = 0
    private maxRows: number = Number.MAX_SAFE_INTEGER

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

    async next(rowsPerAPIRequest?: number): Promise<RowType[]> {
        if (this.endReached) {
            return []
        }

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

        this.next_key = result.next_key
        this.rowsCount += rows.length

        if (!result.next_key || rows.length === 0 || this.rowsCount === this.maxRows) {
            this.endReached = true
        }

        return rows
    }

    async reset() {
        this.next_key = undefined
        this.endReached = false
        this.rowsCount = 0
    }

    async all(): Promise<RowType[]> {
        const rows: RowType[] = []
        for await (const row of this) {
            rows.push(row)
        }
        return rows
    }
}
