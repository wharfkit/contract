import {API, isInstanceOf, UInt64} from '@wharfkit/session'
import {Name} from '@wharfkit/session'
import {Table} from './table'

interface TableCursorParams<TableRow> {
    rows: TableRow[]
    table: Table
    tableParams: API.v1.GetTableRowsParams
    next_key?: Name | UInt64 | undefined
}

/**
 * Represents a cursor for a table in the blockchain. Provides methods for
 * iterating over the rows of the table.
 *
 * @typeparam TableRow The type of rows in the table.
 */
export class TableCursor<TableRow> {
    rows: TableRow[]
    private table: Table
    private next_key: Name | UInt64 | undefined
    private tableParams: API.v1.GetTableRowsParams
    private currentIndex: number

    /**
     * @param {TableCursorParams<TableRow>} params - Parameters for creating a new table cursor.
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
    constructor({rows, table, tableParams, next_key}: TableCursorParams<TableRow>) {
        this.rows = rows
        this.table = table
        this.tableParams = tableParams
        this.next_key = next_key
        this.currentIndex = 0
    }

    /**
     * Implements the iterator protocol for the cursor.
     *
     * @returns An iterator for the rows in the table.
     */
    [Symbol.iterator]() {
        return {
            next: () => {
                if (this.currentIndex < this.rows.length) {
                    return {value: this.rows[this.currentIndex++], done: false}
                } else {
                    this.currentIndex = 0
                    return {done: true}
                }
            },
        }
    }

    /**
     * The number of rows currently in the cursor.
     *
     * @type {number}
     */
    get length() {
        return this.rows.length
    }

    /**
     * Executes a provided function once for each table row.
     *
     * @param {function(row: TableRow, index: number, array: TableRow[]): void} callback - Function to execute for each row.
     */
    forEach(callback: (row: TableRow, index: number, array: TableRow[]) => void) {
        this.rows.forEach(callback)
    }

    /**
     * Creates a new array with the results of calling a provided function on every element in the array of rows.
     *
     * @param {function(row: TableRow, index: number, array: TableRow[]): any} callback - Function to call for each row.
     * @returns The new array with the results of the callback function.
     */
    map(callback: (row: TableRow, index: number, array: TableRow[]) => any) {
        return this.rows.map(callback)
    }

    /**
     * Fetches more rows from the table and appends them to the cursor.
     *
     * @returns This cursor with the updated rows.
     */

    async more() {
        if (!this.next_key) {
            return this
        }

        let upper_bound

        if (this.tableParams.upper_bound) {
            upper_bound = isInstanceOf(this.tableParams.upper_bound, Name)
                ? Name.from(this.tableParams.upper_bound)
                : UInt64.from(this.tableParams.upper_bound)
        }

        const {rows, next_key} = await this.table.getTableRows({
            ...this.tableParams,
            lower_bound:
                this.next_key instanceof Name
                    ? Name.from(this.next_key)
                    : UInt64.from(this.next_key),
            upper_bound: upper_bound ? upper_bound : undefined,
            index_position: this.tableParams.index_position || 'primary',
        })

        this.rows = this.rows.concat(rows)
        this.next_key = next_key

        return this
    }
}
