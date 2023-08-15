import {API} from '@wharfkit/antelope'
import {TableCursor} from './table-cursor'

export class TableScopeCursor extends TableCursor {
    /**
     * Fetch the next batch of rows from the cursor.
     *
     * @param rowsPerAPIRequest The number of rows to fetch per API request.
     * @returns A promise containing the next batch of rows.
     */
    async next(
        rowsPerAPIRequest: number = Number.MAX_SAFE_INTEGER
    ): Promise<API.v1.GetTableByScopeResponseRow[]> {
        // If the cursor has deemed its at the end, return an empty array
        if (this.endReached) {
            return []
        }

        // Set the lower_bound, and override if the cursor has a next_key value
        let lower_bound = this.params.lower_bound
        if (this.next_key) {
            lower_bound = this.next_key
        }

        // Determine the maximum number of remaining rows for the cursor
        const rowsRemaining = this.maxRows - this.rowsCount

        // Find the lowest amount between rows remaining, rows per request, or the provided query params limit
        const limit = Math.min(rowsRemaining, rowsPerAPIRequest, this.params.limit)

        // Assemble and perform the v1/chain/get_table_rows query
        const query: API.v1.GetTableByScopeParams = {
            code: this.params.code,
            table: this.params.table,
            limit,
            lower_bound: lower_bound ? String(lower_bound) : undefined,
            upper_bound: this.params.upper_bound ? String(this.params.upper_bound) : undefined,
        }

        const result = await this.client!.v1.chain.get_table_by_scope(query)

        // Retrieve the rows from the result, decoding if needed
        const rows: API.v1.GetTableByScopeResponseRow[] = result.rows

        // Persist cursor state for subsequent calls
        this.next_key = result.more
        this.rowsCount += rows.length

        // Determine if we've reached the end of the cursor
        if (!result.more || rows.length === 0 || this.rowsCount === this.maxRows) {
            this.endReached = true
        }

        return rows
    }
}
