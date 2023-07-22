import {
    API,
    Checksum160,
    Checksum256,
    Float64,
    Name,
    Serializer,
    UInt128,
    UInt64,
} from '@greymass/eosio'
import {wrapIndexValue} from '../utils'
import {Query, Table} from './table'

interface TableCursorParams {
    table: Table<any>
    tableParams: API.v1.GetTableRowsParams
    maxRows?: number
    next_key?: Name | UInt64 | UInt128 | Float64 | Checksum256 | Checksum160 | undefined
    indexPositionField?: string
}

/**
 * Represents a cursor for a table in the blockchain. Provides methods for
 * iterating over the rows of the table.
 */
export class TableCursor<RowType = any> {
    private table: Table<RowType>
    private next_key: Name | UInt64 | UInt128 | Float64 | Checksum256 | Checksum160 | undefined
    private tableParams: API.v1.GetTableRowsParams
    private endReached = false
    private indexPositionField?: string
    private rowsCount = 0
    private maxRows: number = Number.MAX_SAFE_INTEGER

    /**
     * @param {TableCursorParams} params - Parameters for creating a new table cursor.
     *
     * @param {Table} params.table - The table that the rows belong to.
     *
     * @param {API.v1.GetTableRowsParams} params.tableParams - Parameters for the `get_table_rows`
     * API call, which are used to fetch the rows from the blockchain.
     *
     * @param {(Name | UInt64 | undefined)} [params.next_key] - The key for the next set of rows
     * that the cursor can fetch. This is used for pagination when there are more rows than can be
     * fetched in a single API call.
     */
    constructor({table, tableParams, indexPositionField, maxRows, next_key}: TableCursorParams) {
        this.table = table
        this.tableParams = tableParams
        this.next_key = next_key
        this.indexPositionField = indexPositionField
        if (maxRows) {
            this.maxRows = maxRows
        }
    }

    /**
     * Implements the async iterator protocol for the cursor.
     *
     * @returns An iterator for the rows in the table.
     */
    async *[Symbol.asyncIterator]() {
        while (true) {
            const rows = await this.next()

            for (const row of rows) {
                yield row
            }

            // If no rows are returned or next_key is undefined, we have exhausted all rows
            if (rows.length === 0 || !this.next_key) {
                return
            }
        }
    }

    /**
     * Fetches more rows from the table and appends them to the cursor.
     *
     * @returns The new rows.
     */
    async next(rowsPerAPIRequest?: number): Promise<RowType[]> {
        if (this.endReached) {
            return []
        }

        let lower_bound = this.tableParams.lower_bound
        const upper_bound = this.tableParams.upper_bound

        if (this.next_key) {
            lower_bound = this.next_key
        }

        let indexPosition = this.tableParams.index_position || 'primary'

        if (this.indexPositionField) {
            const fieldToIndexMapping = this.table.getFieldToIndex()

            if (!fieldToIndexMapping[this.indexPositionField]) {
                throw new Error(`Field ${this.indexPositionField} is not a valid index.`)
            }

            indexPosition = fieldToIndexMapping[this.indexPositionField].index_position
        }

        const result = await this.table.contract.client!.v1.chain.get_table_rows({
            ...this.tableParams,
            limit: Math.min(
                this.maxRows - this.rowsCount,
                rowsPerAPIRequest || this.tableParams.limit
            ),
            lower_bound: wrapIndexValue(lower_bound),
            upper_bound: wrapIndexValue(upper_bound),
            index_position: indexPosition,
            json: false,
        })

        let {rows} = result
        this.next_key = result.next_key

        this.rowsCount += rows.length

        if (!result.next_key || rows.length === 0 || this.rowsCount === this.maxRows) {
            this.endReached = true
        }

        if (!this.table.rowType) {
            rows = rows.map((row) =>
                Serializer.decode({
                    data: row,
                    abi: this.table.contract.abi,
                    type: this.table.abi.type,
                })
            )
        }

        return rows
    }

    /**
     * Resets the cursor to the beginning of the table and returns the first rows.
     *
     * @returns The first rows in the table.
     */
    async reset() {
        this.next_key = undefined
        this.endReached = false
        this.rowsCount = 0
    }

    /**
     * Returns all rows in the cursor query.
     *
     * @returns All rows in the cursor query.
     */
    async all(): Promise<RowType[]> {
        const rows: any[] = []
        for await (const row of this) {
            rows.push(row)
        }
        return rows
    }

    /**
     * Returns a new cursor with updated parameters.
     *
     * @returns A new cursor with updated parameters.
     */
    query(query: Query) {
        return new TableCursor({
            table: this.table,
            tableParams: {
                ...this.tableParams,
                limit: query.rowsPerAPIRequest || this.tableParams.limit,
                scope: query.scope || this.tableParams.scope,
                lower_bound: query.from ? wrapIndexValue(query.from) : this.tableParams.lower_bound,
                upper_bound: query.to ? wrapIndexValue(query.to) : this.tableParams.upper_bound,
            },
        })
    }
}
