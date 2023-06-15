import {ABI, ABISerializableConstructor, APIClient, Name, NameType, UInt64} from '@wharfkit/session'
import type {Contract} from '../contract'
import {indexPositionInWords} from '../utils'
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
    contract: Contract
    name: NameType
    client: APIClient
    rowType?: TableRow
    fieldToIndex?: FieldToIndex
}

interface GetTableRowsOptions {
    limit?: number
}

/**
 * Represents a table in a smart contract.
 * Provides methods for querying rows in the table.
 *
 * @typeparam TableRow The type of rows in the table.
 */
export class Table<TableRow extends ABISerializableConstructor = ABISerializableConstructor> {
    readonly name: Name
    readonly contract: Contract
    readonly rowType?: TableRow

    private fieldToIndex?: any

    /**
     * Constructs a new `Table` instance.
     *
     * @param {TableParams<TableRow>} tableParams - Parameters for the table.
     * The parameters should include:
     *  - `contract`: Name of the contract that this table is associated with.
     *  - `name`: Name of the table.
     *  - `client`: Client object to interact with the network.
     *  - `rowType`: (optional) Custom row type.
     *  - `fieldToIndex`: (optional) Mapping of fields to their indices.
     */
    constructor({contract, name, client, rowType, fieldToIndex}: TableParams<TableRow>) {
        this.name = Name.from(name)
        this.rowType = rowType
        this.fieldToIndex = fieldToIndex
        this.contract = contract
    }

    /**
     * Creates a new `Table` instance from the given parameters.
     *
     * @param {TableParams} tableParams - Parameters for the table.
     * The parameters should include:
     *  - `contract`: Name of the contract that this table is associated with.
     *  - `name`: Name of the table.
     *  - `client`: Client object to interact with the network.
     *  - `rowType`: (optional) Custom row type.
     *  - `fieldToIndex`: (optional) Mapping of fields to their indices.
     * @returns {Table} A new Table instance.
     */
    static from(tableParams: TableParams) {
        return new Table(tableParams)
    }

    /**
     * Retrieves the rows from the table that match the given parameters.
     *
     * @param {QueryParams} queryParams - Query parameters to filter rows (eg. `{id: {from: 1, to: 10}}`)
     *  Each key-value pair in the queryParams object corresponds to a field and its expected value in the table.
     * @param {GetTableRowsOptions} options - Options for retrieving the table rows.
     *  May include:
     *  - `limit`: Maximum number of rows to return.
     * @returns {TableCursor<TableRow>} Promise resolving to a `TableCursor` of the filtered table rows.
     */
    where(queryParams: QueryParams, {limit = 10}: GetTableRowsOptions = {}): TableCursor<TableRow> {
        const {from, to} = queryParams[Object.keys(queryParams)[0]]

        const lower_bound = from && (typeof from === 'string' ? Name.from(from) : UInt64.from(from))
        const upper_bound = to && (typeof to === 'string' ? Name.from(to) : UInt64.from(to))

        const tableRowsParams = {
            table: this.name,
            code: this.contract.account,
            scope: this.contract.account,
            type: this.rowType,
            limit,
            lower_bound,
            upper_bound,
        }

        return new TableCursor({
            table: this,
            tableParams: tableRowsParams,
            indexPositionField: Object.keys(queryParams)[0],
        })
    }

    /**
     * Retrieves the row from the table that matches the given parameters.
     *
     * @param {QueryParams} queryParams - Query parameters to identify a single row (eg. `{ id: 1 }`).
     *  Each key-value pair in the queryParams object corresponds to a field and its expected value in the table.
     * @returns {Promise<TableRow>} Promise resolving to a single table row.
     */
    async find(queryParams: QueryParams): Promise<TableRow> {
        const fieldToIndexMapping = await this.getFieldToIndex()

        const fieldName = Object.keys(queryParams)[0]
        const entryFieldValue = Object.values(queryParams)[0] as string

        const tableRowsParams = {
            table: this.name,
            code: this.contract.account,
            scope: this.contract.account,
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

        const {rows} = await this.contract.client!.v1.chain.get_table_rows(tableRowsParams)

        return rows[0]
    }

    /**
     * Retrieves all the rows from the table.
     *
     * @param {GetTableRowsOptions} options - Options for retrieving the table rows.
     *  May include:
     *  - `limit`: Maximum number of rows to return.
     * @returns {TableCursor<TableRow>} Promise resolving to a `TableCursor` of the table rows.
     */
    first(limit: number): TableCursor<TableRow> {
        const tableRowsParams = {
            table: this.name,
            limit,
            code: this.contract.account,
            type: this.rowType,
        }

        return new TableCursor({
            table: this,
            tableParams: tableRowsParams,
        })
    }

    /**
     * Returns a cursor to get every single rows on the table.
     * @returns {TableCursor<TableRow>}
     */
    cursor(): TableCursor<TableRow> {
        const tableRowsParams = {
            table: this.name,
            code: this.contract.account,
            type: this.rowType,
            limit: 1000000,
        }

        return new TableCursor({
            table: this,
            tableParams: tableRowsParams,
        })
    }

    /**
     * Returns all the rows from the table.
     * @returns {Promise<TableRow[]>} Promise resolving to an array of table rows.
     */
    async all(): Promise<TableRow[]> {
        return this.cursor().all()
    }

    async getFieldToIndex() {
        if (this.fieldToIndex) {
            return this.fieldToIndex
        }

        const abi = await this.getAbi()

        const table = abi.tables.find((table) => this.name.equals(table.name))

        if (!table) {
            throw new Error(`Table ${this.name} not found in ABI`)
        }

        const fieldToIndex = {}

        for (let i = 0; i < table.key_names.length; i++) {
            fieldToIndex[table.key_names[i]] = {
                type: table.key_types[i],
                index_position: indexPositionInWords(i),
            }
        }

        return fieldToIndex
    }

    private async getAbi(): Promise<ABI.Def> {
        if (!this.contract) {
            throw new Error(
                'Contract must be passed as a parameter in order for getAbi to be called.'
            )
        }
        return this.contract.getAbi()
    }
}
