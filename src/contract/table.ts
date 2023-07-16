import {ABI, ABISerializableConstructor, API, Name, NameType} from '@wharfkit/session'
import type {Contract} from '../contract'
import {indexPositionInWords, wrapIndexValue} from '../utils'
import {TableCursor} from './table-cursor'

export interface FindOptions {
    index?: string
    scope?: NameType
    key_type?: keyof API.v1.TableIndexTypes
}

export interface QueryOptions extends FindOptions {
    limit?: number
}

export interface Query {
    from: API.v1.TableIndexType | string
    to: API.v1.TableIndexType | string
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
    rowType?: TableRow
    fieldToIndex?: FieldToIndex
}

export interface GetTableRowsOptions {
    limit?: number
    scope?: NameType
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
    constructor({contract, name, rowType, fieldToIndex}: TableParams<TableRow>) {
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
    query(
        query: Query,
        {limit = 10, scope = this.contract.account, index, key_type}: QueryOptions = {}
    ): TableCursor<TableRow> {
        const {from, to} = query

        const tableRowsParams = {
            table: this.name,
            code: this.contract.account,
            scope,
            type: this.rowType,
            limit,
            lower_bound: wrapIndexValue(from),
            upper_bound: wrapIndexValue(to),
            key_type: key_type,
        }

        return new TableCursor({
            table: this,
            tableParams: tableRowsParams,
            indexPositionField: index,
        })
    }

    /**
     * Retrieves the row from the table that matches the given parameters.
     *
     * @param {QueryParams} queryParams - Query parameters to identify a single row (eg. `{ id: 1 }`).
     *  Each key-value pair in the queryParams object corresponds to a field and its expected value in the table.
     * @returns {Promise<TableRow>} Promise resolving to a single table row.
     */
    async get(
        queryValue: API.v1.TableIndexType | string,
        {scope = this.contract.account, index, key_type}: QueryOptions = {}
    ): Promise<TableRow> {
        const fieldToIndexMapping = await this.getFieldToIndex()

        const tableRowsParams = {
            table: this.name,
            code: this.contract.account,
            scope,
            type: this.rowType!,
            limit: 1,
            lower_bound: wrapIndexValue(queryValue),
            upper_bound: wrapIndexValue(queryValue),
            index_position: index ? fieldToIndexMapping[index].index_position : 'primary',
            key_type: key_type,
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

        const table = await this.getAbiTable()

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
        return this.contract.abi
    }

    private async getAbiTable(): Promise<ABI.Table | undefined> {
        const abi = await this.getAbi()
        return abi.tables.find((table) => this.name.equals(table.name))
    }

    private async getTableStruct(): Promise<ABI.Struct | undefined> {
        const abi = await this.getAbi()
        const table = await this.getAbiTable()
        return abi.structs.find((struct) => table?.type === String(struct.name))
    }
}
