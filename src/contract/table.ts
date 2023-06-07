import {APIClient, Name, NameType, UInt64} from '@wharfkit/session'
import {TableCursor} from './table-cursor'

interface QueryParams {
    [key: string]: any
}

interface FieldToIndex {
    [key: string]: {
        type: string
        index_position: string
    }
}
interface TableParams<TableRow = any> {
    account: NameType
    tableName: NameType
    client: APIClient
    tableStruct?: TableRow
    fieldToIndex?: FieldToIndex
}

interface GetTableRowsOptions {
    limit?: number
}

export class Table<TableRow = any> {
    private client: APIClient
    private account: Name
    private tableName: Name
    private tableStruct?: TableRow
    private fieldToIndex?: any

    constructor({account, tableName, client, tableStruct, fieldToIndex}: TableParams<TableRow>) {
        this.account = Name.from(account)
        this.tableName = Name.from(tableName)
        this.client = client
        this.tableStruct = tableStruct
        this.fieldToIndex = fieldToIndex
    }

    static from(tableParams: TableParams) {
        return new Table(tableParams)
    }

    async where(
        queryParams: QueryParams,
        {limit = 10}: GetTableRowsOptions = {}
    ): Promise<TableCursor<TableRow>> {
        const fieldToIndexMapping = this.fieldToIndex || (await this.getFieldToIndex())

        const {from, to} = queryParams[Object.keys(queryParams)[0]]

        const lower_bound = typeof from === 'string' ? Name.from(from) : UInt64.from(from)
        const upper_bound = typeof to === 'string' ? Name.from(to) : UInt64.from(to)

        const tableRowsParams = {
            table: this.tableName,
            code: this.account,
            scope: this.account,
            type: this.tableStruct,
            limit,
            lower_bound,
            upper_bound,
            index_position: fieldToIndexMapping[Object.keys(queryParams)[0]].index_position,
        }

        let response

        try {
            response = await this.client.v1.chain.get_table_rows(tableRowsParams)
        } catch (error) {
            throw new Error(`Error fetching table rows: ${JSON.stringify(error)}`)
        }

        const {rows, next_key} = response

        return new TableCursor({
            rows,
            client: this.client,
            tableParams: tableRowsParams,
            next_key: String(next_key),
        })
    }

    async find(queryParams: QueryParams): Promise<TableRow> {
        const fieldToIndexMapping = this.fieldToIndex || (await this.getFieldToIndex())

        const fieldName = Object.keys(queryParams)[0]
        const entryFieldValue = Object.values(queryParams)[0] as string

        const tableRowsParams = {
            table: this.tableName,
            code: this.account,
            scope: this.account,
            type: this.tableStruct,
            limit: 1,
            lower_bound:
                typeof entryFieldValue === 'string'
                    ? Name.from(entryFieldValue)
                    : UInt64.from(entryFieldValue),
            upper_bound:
                typeof entryFieldValue === 'string'
                    ? Name.from(entryFieldValue)
                    : UInt64.from(entryFieldValue),
            index_position: fieldToIndexMapping[fieldName].index_position,
        }

        const {rows} = await this.client!.v1.chain.get_table_rows(tableRowsParams)

        return rows[0]
    }

    async all({limit = 10}: GetTableRowsOptions = {}): Promise<TableCursor<TableRow>> {
        const tableRowsParams = {
            table: this.tableName,
            limit,
            code: this.account,
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

        const table = abi.tables.find((table) => this.tableName.equals(table.name))

        if (!table) {
            throw new Error(`Table ${this.tableName} not found in ABI`)
        }

        const fieldToIndex = {}

        for (let i = 0; i < table.key_names.length; i++) {
            fieldToIndex[table.key_names[i]] = {
                type: table.key_types[i],
                index_position: indexPosition(i),
            }
        }

        return fieldToIndex
    }
}

function indexPosition(index: number): string {
    return [
        'primary',
        'secondary',
        'tertiary',
        'fourth',
        'fifth',
        'sixth',
        'seventh',
        'eighth',
        'ninth',
        'tenth',
    ][index]
}
