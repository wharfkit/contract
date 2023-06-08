import {API, isInstanceOf, UInt64} from '@wharfkit/session'
import {Name} from '@wharfkit/session'
import {Table} from './table'

interface TableCursorParams<TableRow> {
    rows: TableRow[]
    table: Table
    tableParams: API.v1.GetTableRowsParams
    next_key?: Name | UInt64 | undefined
}

export class TableCursor<TableRow> {
    rows: TableRow[]
    private table: Table
    private next_key: Name | UInt64 | undefined
    private tableParams: API.v1.GetTableRowsParams
    private currentIndex: number

    constructor({rows, table, tableParams, next_key}: TableCursorParams<TableRow>) {
        this.rows = rows
        this.table = table
        this.tableParams = tableParams
        this.next_key = next_key
        this.currentIndex = 0
    }

    // Allows for iteration through rows
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

    get length() {
        return this.rows.length
    }

    forEach(callback: (row: TableRow, index: number, array: TableRow[]) => void) {
        this.rows.forEach(callback)
    }

    map(callback: (row: TableRow, index: number, array: TableRow[]) => any) {
        return this.rows.map(callback)
    }

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
