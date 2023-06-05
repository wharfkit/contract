import {NameType, Name, APIClient} from '@wharfkit/session'
import {TableCursor} from './table-cursor'
import {Contract} from '../contract'

interface TableParams {
    account: NameType
    table: NameType
    client: APIClient
    tableStruct: any
}

export class Table {
    private client: APIClient
    private account: Name
    private table: Name
    private tableStruct: any

    constructor({account, table, client, tableStruct}: TableParams) {
        this.account = Name.from(account)
        this.table = Name.from(table)
        this.client = client
        this.tableStruct = tableStruct
    }

    async where(fieldToIndex, queryParams: any, {limit = 10} = {}) {
        const fieldToIndexMapping = fieldToIndex || (await this.getFieldToIndex())

        const {from, to} = queryParams

        const lower_bound = from ? Name.from(from) : undefined
        const upper_bound = to ? Name.from(to) : undefined

        const tableRowsParams = {
            table: this.table,
            code: this.account,
            scope: this.account,
            type: this.tableStruct,
            limit,
            lower_bound,
            upper_bound,
            index_position: fieldToIndexMapping[Object.keys(queryParams)[0]],
        }

        const {rows, next_key} = await this.client!.v1.chain.get_table_rows(tableRowsParams)

        return new TableCursor({
            rows,
            client: this.client,
            tableParams: tableRowsParams,
            next_key: String(next_key),
        })
    }

    async find(fieldToIndex, queryParams: any) {
        const fieldToIndexMapping = fieldToIndex || (await this.getFieldToIndex())

        const fieldName = Object.keys(queryParams)[0]
        const entryFieldValue = Object.values(queryParams)[0] as string

        const tableRowsParams = {
            table: this.table,
            code: this.account,
            scope: this.account,
            type: this.tableStruct,
            limit: 1,
            lower_bound: Name.from(entryFieldValue),
            upper_bound: Name.from(entryFieldValue),
            index_position: fieldToIndexMapping[fieldName],
        }

        const {rows} = await this.client!.v1.chain.get_table_rows(tableRowsParams)

        return rows[0]
    }

    async all(contract, table, tableParams, {limit = 10} = {}) {
        const tableRowsParams = {
            table,
            limit,
            code: contract,
            type: this.tableStruct,
        }

        const {rows, next_key} = await this.client.v1.chain.get_table_rows(tableRowsParams)

        return new TableCursor({
            rows,
            client: this.client,
            tableParams: tableRowsParams,
            next_key: String(next_key),
        })
    }

    async getFieldToIndex() {
        const {abi} = await this.client.v1.chain.get_abi(this.account)

        if (!abi) {
            throw new Error(`ABI not found for contract ${this.account}`)
        }

        const table = abi.tables.find((table) => table.name === this.table)

        if (!table) {
            throw new Error(`Table ${this.table} not found in ABI`)
        }

        const fieldToIndex = {}

        for (let i = 0; i < table.key_names.length; i++) {
            fieldToIndex[table.key_names[i]] = {
                type: table.key_types[i],
                index_position: indexPosition(i),
            }
        }
    }
}

function indexPosition(index: number): string {
    return ['primary', 'secondary', 'tertiary'][index]
}
