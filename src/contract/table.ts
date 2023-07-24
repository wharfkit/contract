import {ABI, ABIDef, API, APIClient, Name, NameType, Serializer} from '@greymass/eosio'
import {indexPositionInWords, wrapIndexValue} from '../utils'
import {TableCursor} from './table-cursor'

export interface QueryOptions {
    index?: string
    scope?: NameType
    key_type?: keyof API.v1.TableIndexTypes
}

export interface Query extends QueryOptions {
    from?: API.v1.TableIndexType | string | number
    to?: API.v1.TableIndexType | string | number
    rowsPerAPIRequest?: number
}

interface FieldToIndex {
    [key: string]: {
        type: string
        index_position: string
    }
}
interface TableParams<TableRow = any> {
    abi: ABIDef
    account: NameType
    client: APIClient
    name: NameType
    rowType?: TableRow
    fieldToIndex?: FieldToIndex
    defaultRowLimit?: number
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
export class Table<RowType = any> {
    readonly abi: ABI
    readonly account: Name
    readonly client: APIClient
    readonly name: Name
    readonly rowType?: RowType
    readonly tableABI: ABI.Table

    private fieldToIndex?: any

    public defaultRowLimit = 1000

    /**
     * Constructs a new `Table` instance.
     *
     * @param {TableParams} tableParams - Parameters for the table.
     * The parameters should include:
     *  - `contract`: Name of the contract that this table is associated with.
     *  - `name`: Name of the table.
     *  - `client`: Client object to interact with the network.
     *  - `rowType`: (optional) Custom row type.
     *  - `fieldToIndex`: (optional) Mapping of fields to their indices.
     */
    constructor(args: TableParams) {
        this.abi = ABI.from(args.abi)
        this.account = Name.from(args.account)
        this.name = Name.from(args.name)
        this.client = args.client
        this.rowType = args.rowType
        this.fieldToIndex = args.fieldToIndex
        const tableABI = this.abi.tables.find((table) => this.name.equals(table.name))
        if (!tableABI) {
            throw new Error(`Table ${this.name} not found in ABI`)
        }
        this.tableABI = tableABI
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
    query(query: Query): TableCursor<RowType> {
        const {from, to, rowsPerAPIRequest} = query

        const tableRowsParams: any = {
            table: this.name,
            code: this.account,
            scope: query.scope || this.account,
            type: this.rowType,
            limit: rowsPerAPIRequest || this.defaultRowLimit,
            lower_bound: wrapIndexValue(from),
            upper_bound: wrapIndexValue(to),
            key_type: query.key_type,
        }

        if (query.index) {
            const fieldToIndexMapping = this.getFieldToIndex()

            if (!fieldToIndexMapping[query.index]) {
                throw new Error(`Field ${query.index} is not a valid index.`)
            }

            tableRowsParams.index_position = fieldToIndexMapping[query.index].index_position
        }

        return new TableCursor<RowType>({
            abi: this.abi,
            client: this.client,
            params: tableRowsParams,
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
        {scope = this.account, index, key_type}: QueryOptions = {}
    ): Promise<RowType> {
        const fieldToIndexMapping = this.getFieldToIndex()

        const tableRowsParams = {
            table: this.name,
            code: this.account,
            scope,
            type: this.rowType!,
            limit: 1,
            lower_bound: wrapIndexValue(queryValue),
            upper_bound: wrapIndexValue(queryValue),
            index_position: index ? fieldToIndexMapping[index].index_position : 'primary',
            key_type: key_type,
            json: false,
        }

        let {rows} = await this.client!.v1.chain.get_table_rows(tableRowsParams)

        if (!this.rowType) {
            rows = [
                Serializer.decode({
                    data: rows[0],
                    abi: this.abi,
                    type: this.tableABI.type,
                }),
            ]
        }

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
    first(maxRows: number, options: QueryOptions = {}): TableCursor<RowType> {
        const tableRowsParams = {
            table: this.name,
            limit: maxRows,
            code: this.account,
            type: this.rowType,
            scope: options.scope,
        }

        return new TableCursor<RowType>({
            abi: this.abi,
            client: this.client,
            maxRows,
            params: tableRowsParams,
        })
    }

    /**
     * Returns a cursor to get every single rows on the table.
     * @returns {TableCursor}
     */
    cursor(): TableCursor<RowType> {
        const tableRowsParams = {
            table: this.name,
            code: this.account,
            type: this.rowType,
            limit: this.defaultRowLimit,
        }

        return new TableCursor<RowType>({
            abi: this.abi,
            client: this.client,
            params: tableRowsParams,
        })
    }

    /**
     * Returns all the rows from the table.
     * @returns {Promise<TableRow[]>} Promise resolving to an array of table rows.
     */
    async all(): Promise<RowType[]> {
        return this.cursor().all()
    }

    getFieldToIndex() {
        if (this.fieldToIndex) {
            return this.fieldToIndex
        }

        const fieldToIndex = {}

        for (let i = 0; i < this.tableABI.key_names.length; i++) {
            fieldToIndex[this.tableABI.key_names[i]] = {
                type: this.tableABI.key_types[i],
                index_position: indexPositionInWords(i),
            }
        }

        return fieldToIndex
    }
}
