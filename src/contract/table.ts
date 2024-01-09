import {ABI, ABIDef, API, APIClient, Name, NameType, Serializer} from '@wharfkit/antelope'
import {indexPositionInWords, wrapIndexValue} from '../utils'
import {TableRowCursor} from './row-cursor'
import {TableScopeCursor} from './scope-cursor'
import {TableCursor} from './table-cursor'

export interface QueryParams {
    index?: string
    index_position?: string
    scope?: NameType | number
    key_type?: keyof API.v1.TableIndexTypes
    json?: boolean
    from?: API.v1.TableIndexType | string | number
    to?: API.v1.TableIndexType | string | number
    maxRows?: number
    rowsPerAPIRequest?: number
    reverse?: boolean
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
    defaultScope?: NameType
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

    public defaultScope?: NameType
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
        this.defaultScope = args.defaultScope
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
    static from<RowType = any>(tableParams: TableParams): Table<RowType> {
        return new Table<RowType>(tableParams)
    }

    /**
     * Retrieves the rows from the table that match the given parameters.
     *
     * @param {QueryParams} queryParams - Query parameters to filter rows (eg. `{id: {from: 1, to: 10}}`)
     *  Each key-value pair in the queryParams object corresponds to a field and its expected value in the table.
     * @returns {TableCursor<TableRow>} Promise resolving to a `TableCursor` of the filtered table rows.
     */
    query(params: QueryParams = {}): TableCursor<RowType> {
        const tableRowsParams: any = {
            // Table query
            table: this.name,
            code: this.account,
            scope:
                params.scope !== undefined
                    ? String(params.scope)
                    : this.defaultScope || this.account,
            // Response typing
            type: this.rowType,
            // Filtering
            index_position: params.index_position,
            key_type: params.key_type,
            lower_bound: wrapIndexValue(params.from),
            upper_bound: wrapIndexValue(params.to),
            limit: params.rowsPerAPIRequest || this.defaultRowLimit,
            reverse: params.reverse,
        }

        if (params.index) {
            const fieldToIndexMapping = this.getFieldToIndex()

            if (!fieldToIndexMapping[params.index]) {
                // Nearly all contract ABIs are missing data to appropriately map this data.
                // See: https://github.com/AntelopeIO/cdt/issues/197
                throw new Error(
                    `Field ${params.index} is not listed in the ABI under key_names/key_types. Try using 'index_position' instead.`
                )
            }

            tableRowsParams.index_position = fieldToIndexMapping[params.index].index_position
        }

        return new TableRowCursor<RowType>({
            abi: this.abi,
            client: this.client,
            maxRows: params.maxRows,
            params: tableRowsParams,
        })
    }

    /**
     * Retrieves the row from the table that matches the given parameters.
     *
     * @param {API.v1.TableIndexType | string} value - The value to match against the index.
     * @param {QueryParams} queryParams - Query parameters to identify a single row (eg. `{ id: 1 }`).
     *  Each key-value pair in the queryParams object corresponds to a field and its expected value in the table.
     * @returns {Promise<TableRow>} Promise resolving to a single table row.
     */
    async get(
        value?: API.v1.TableIndexType | string,
        params: QueryParams = {}
    ): Promise<RowType | undefined> {
        const tableRowsParams: any = {
            table: this.name,
            code: this.account,
            scope:
                params.scope !== undefined
                    ? String(params.scope)
                    : this.defaultScope || this.account,
            type: this.rowType!,
            limit: 1,
            lower_bound: wrapIndexValue(value),
            upper_bound: wrapIndexValue(value),
            index_position: params.index_position,
            key_type: params.key_type,
            json: false,
            reverse: params.reverse,
        }

        if (params.index) {
            const fieldToIndexMapping = this.getFieldToIndex()

            if (!fieldToIndexMapping[params.index]) {
                // Nearly all contract ABIs are missing data to appropriately map this data.
                // See: https://github.com/AntelopeIO/cdt/issues/197
                throw new Error(
                    `Field ${params.index} is not listed in the ABI under key_names/key_types. Try using 'index_position' instead.`
                )
            }

            tableRowsParams.index_position = fieldToIndexMapping[params.index].index_position
        }

        const {rows} = await this.client!.v1.chain.get_table_rows(tableRowsParams)

        if (rows.length === 0) {
            return undefined
        }
        let [row] = rows

        if (!this.rowType) {
            row = Serializer.decode({
                data: row,
                abi: this.abi,
                type: this.tableABI.type,
            })
        }

        if (params.json) {
            row = Serializer.objectify(row)
        }

        return row
    }

    /**
     * Retrieves all the rows from the table.
     *
     * @param {number} maxRows - The maximum number of rows to return.
     * @param {QueryParams} queryParams - Query parameters to filter rows.
     * @returns {TableCursor<TableRow>} Promise resolving to a `TableCursor` of the table rows.
     */
    first(maxRows: number, params: QueryParams = {}): TableCursor<RowType> {
        return this.query({
            ...params,
            maxRows,
        })
    }

    /**
     * Returns all the rows from the table.
     * @returns {Promise<TableRow[]>} Promise resolving to an array of table rows.
     */
    async all(params: QueryParams = {}): Promise<RowType[]> {
        return this.query(params).all()
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

    scopes(params: QueryParams = {}): TableScopeCursor {
        const tableRowsParams: any = {
            // Table query
            code: this.account,
            table: this.name,
            // Filtering
            lower_bound: wrapIndexValue(params.from),
            upper_bound: wrapIndexValue(params.to),
            limit: params.rowsPerAPIRequest || this.defaultRowLimit,
            reverse: params.reverse,
        }

        return new TableScopeCursor({
            abi: this.abi,
            client: this.client,
            maxRows: params.maxRows,
            params: tableRowsParams,
        })
    }
}
