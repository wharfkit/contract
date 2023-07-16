import {API} from '@wharfkit/session'
import {wrapIndexValue} from '../utils'
import {Query, QueryOptions, Table} from './table'

interface TableCursorParams {
    table: Table
    tableParams: API.v1.GetTableRowsParams
    next_key?: API.v1.TableIndexType | string
    indexPositionField?: string
}

/**
 * Represents a cursor for a table in the blockchain. Provides methods for
 * iterating over the rows of the table.
 *
 * @typeparam TableRow The type of rows in the table.
 */
export class TableCursor<TableRow> {
    private table: Table
    private next_key: API.v1.TableIndexType | string | undefined
    private tableParams: API.v1.GetTableRowsParams
    private endReached = false
    private indexPositionField?: string
    private rowsCount = 0

    /**
     * @param {TableCursorParams} params - Parameters for creating a new table cursor.
     *
     * @param {TableRow[]} params.rows - An array of rows that the cursor will iterate over.
     * Each row represents an entry in the table.
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
    constructor({table, tableParams, indexPositionField, next_key}: TableCursorParams) {
        this.table = table
        this.tableParams = tableParams
        this.next_key = next_key
        this.indexPositionField = indexPositionField
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
    async next(): Promise<TableRow[]> {
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
            const fieldToIndexMapping = await this.table.getFieldToIndex()

            if (!fieldToIndexMapping[this.indexPositionField]) {
                throw new Error(`Field ${this.indexPositionField} is not a valid index.`)
            }

            indexPosition = fieldToIndexMapping[this.indexPositionField].index_position
        }

        const {rows, next_key} = await this.table.contract.client!.v1.chain.get_table_rows({
            ...this.tableParams,
            limit: Math.min(this.tableParams.limit - this.rowsCount, 1000000),
            lower_bound: wrapIndexValue(lower_bound),
            upper_bound: wrapIndexValue(upper_bound),
            index_position: indexPosition,
        })

        this.next_key = next_key

        if (!next_key || rows.length === 0 || this.rowsCount === this.tableParams.limit) {
            this.endReached = true
        }

        this.rowsCount += rows.length

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
    async all() {
        const rows: TableRow[] = []
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
    query(query: Query, {limit}: QueryOptions = {}) {
        return new TableCursor({
            table: this.table,
            tableParams: {
                ...this.tableParams,
                limit: limit || this.tableParams.limit,
                lower_bound: query.from || this.tableParams.lower_bound,
                upper_bound: query.to || this.tableParams.upper_bound,
            },
        })
    }
}
