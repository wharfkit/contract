import type {API, NameType} from '@wharfkit/session'
import {Name, APIClient} from '@wharfkit/session'

type TableRow = any

interface TableCursorParams {
    rows: TableRow[]
    client: APIClient
    tableParams: API.v1.GetTableRowsParams
    next_key?: string
}

export class TableCursor {
    rows: TableRow[]
    private client: APIClient
    private next_key: string | undefined
    private tableParams: API.v1.GetTableRowsParams
    private currentIndex: number

    constructor({rows, client, tableParams, next_key}: TableCursorParams) {
        this.rows = rows
        this.client = client
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
        const {rows, next_key} = await this.client.v1.chain.get_table_rows({
            ...this.tableParams,
            lower_bound: this.next_key ? Name.from(this.next_key) : undefined,
            upper_bound: undefined,
        })

        this.rows = this.rows.concat(rows)
        this.next_key = String(next_key)

        return this
    }
}
