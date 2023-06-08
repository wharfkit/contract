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
    contract: NameType
    name: NameType
    client: APIClient
    rowType?: TableRow
    fieldToIndex?: FieldToIndex
}

interface GetTableRowsOptions {
    limit?: number
}

export class Table<TableRow = any> {
    private client: APIClient
    private contract: Name
    private name: Name
    private rowType?: TableRow
    private fieldToIndex?: any

    /**
     * Constructs a new `Table` instance.
     *
     * @param {TableParams<TableRow>} tableParams - The parameters for the table.
     */
    constructor({contract, name, client, rowType, fieldToIndex}: TableParams<TableRow>) {
        this.contract = Name.from(contract)
        this.name = Name.from(name)
        this.client = client
        this.rowType = rowType
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
            table: this.name,
            code: this.contract,
            scope: this.contract,
            type: this.rowType,
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
            next_key,
        })
    }

    async find(queryParams: QueryParams): Promise<TableRow> {
        const fieldToIndexMapping = this.fieldToIndex || (await this.getFieldToIndex())

        const fieldName = Object.keys(queryParams)[0]
        const entryFieldValue = Object.values(queryParams)[0] as string

        const tableRowsParams = {
            table: this.name,
            code: this.contract,
            scope: this.contract,
            type: this.rowType,
            limit: 1,
            lower_bound:
                typeof entryFieldValue === 'string'
                    ? Name.from(entryFieldValue)
                    : UInt64.from(entryFieldValue),
            upper_bound:
                typeof entryFieldValue === 'string'
                    ? Name.from(entryFieldValue)
                    : UInt64.from(entryFieldValue),
            index_position: fieldToIndexMapping[fieldName].index_position || 'primary',
        }

        const {rows} = await this.client!.v1.chain.get_table_rows(tableRowsParams)

        return rows[0]
    }

    async all({limit = 10}: GetTableRowsOptions = {}): Promise<TableCursor<TableRow>> {
        const tableRowsParams = {
            table: this.name,
            limit,
            code: this.contract,
            type: this.rowType,
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
            next_key,
        })
    }

    async getFieldToIndex() {
        const {abi} = await this.client.v1.chain.get_abi(this.contract)

        if (!abi) {
            throw new Error(`ABI not found for contract ${this.contract}`)
        }

        const table = abi.tables.find((table) => this.name.equals(table.name))

        if (!table) {
            throw new Error(`Table ${this.name} not found in ABI`)
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
