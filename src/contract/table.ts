import {TableCursor} from './table-cursor'

export class Table {
    async where(contract, table, queryParams: any, {limit = 10} = {}) {
        const getTableRowsParams = await getTableRowsParams(queryParams, {limit})

        const {rows, next_key} = await this.client!.v1.chain.get_table_rows(getTableRowsParams)

        return new TableCursor({
            rows,
            contract,
            table: getTableRowsParams.table,
            options: getTableRowsParams,
            next_key: String(next_key),
        })
    }

    async find(contract, table, queryParams: any) {
        const getTableRowsParams = await getTableRowsParams(queryParams, {limit: 1})

        const {rows} = await this.client!.v1.chain.get_table_rows(getTableRowsParams)

        return rows[0]
    }

    async all(contract, table, {limit = 10} = {}) {
        const {rows} = await this.client!.v1.chain.get_table_rows({table, limit})

        return new TableCursor({
            rows,
            contract,
            table,
            options: {limit},
            next_key: String(next_key),
        })
    }

    async getTableRowsParams(contract, table, queryParams: any, {limit = 10} = {}) {
        const abi = await this.client.ge_abi(this.account)
        const {from, to} = queryParams

        const lower_bound = from ? Name.from(from) : undefined
        const upper_bound = to ? Name.from(to) : undefined

        return {
            table: this.table,
            code: this.account,
            scope: 'users',
            limit,
            lower_bound,
            upper_bound,
        }
    }
}
