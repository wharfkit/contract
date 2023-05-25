import type {NameType} from '@greymass/eosio'

import {Contract, GetTableRowsOptions} from '../contract'

type TableRow = any

interface TableCursorParams {
    rows: TableRow[]
    contract: Contract
    table: NameType
    options: GetTableRowsOptions
    next_key?: string
}

export class TableCursor {
    rows: TableRow[]
    private contract: Contract
    private table: NameType
    private next_key: string | undefined
    private options: GetTableRowsOptions
    private currentIndex: number

    constructor({rows, contract, table, options, next_key}: TableCursorParams) {
        this.rows = rows
        this.contract = contract
        this.table = table
        this.options = options
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
        const {rows, next_key} = await this.contract.getTableRows(String(this.table), {
            ...this.options,
            start: this.next_key,
            end: undefined,
        })

        this.rows = this.rows.concat(rows)
        this.next_key = next_key

        return this
    }
}
