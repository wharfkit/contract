import {API, Serializer} from '@wharfkit/antelope'
import {TableCursor} from './table-cursor'

export class TableRowCursor<RowType = any> extends TableCursor {
    /**
     * Fetch the next batch of rows from the cursor.
     *
     * @param rowsPerAPIRequest The number of rows to fetch per API request.
     * @returns A promise containing the next batch of rows.
     */
    async next(rowsPerAPIRequest: number = Number.MAX_SAFE_INTEGER): Promise<RowType[]> {
        // If the cursor has deemed its at the end, return an empty array
        if (this.endReached) {
            return []
        }

        // Assemble the query params
        const query = this.getTableRowsParams(rowsPerAPIRequest)

        // Execute the query
        const result = await this.client!.v1.chain.get_table_rows(query)

        // Determine if we need to decode the rows, based on if:
        // - json parameter is false, meaning hex data will be returned
        // - type parameter is not set, meaning the APIClient will not automatically decode
        const requiresDecoding =
            this.params.json === false && !(query as API.v1.GetTableRowsParamsTyped).type

        // Retrieve the rows from the result, decoding if needed
        const rows: RowType[] = requiresDecoding
            ? result.rows.map((data) =>
                  Serializer.decode({
                      data,
                      abi: this.abi,
                      type: this.type,
                  })
              )
            : result.rows

        // Persist cursor state for subsequent calls
        this.next_key = result.next_key
        this.rowsCount += rows.length

        // Determine if we've reached the end of the cursor
        if (!result.next_key || rows.length === 0 || this.rowsCount === this.maxRows) {
            this.endReached = true
        }

        return rows
    }
}
