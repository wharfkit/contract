type TableRow = any

export class TableCursor {
    rows: TableRow[]
    private _more: () => Promise<TableCursor>
    private currentIndex: number

    constructor(rows: TableRow[], more: () => Promise<TableCursor>) {
        this.rows = rows
        this._more = more
        this.currentIndex = 0
    }

    // Allows for iteration through rows
    [Symbol.iterator]() {
        return {
            next: () => {
                if (this.currentIndex < this.rows.length) {
                    return {value: this.rows[this.currentIndex++], done: false}
                } else {
                    this.currentIndex = 0
                    return {done: true}
                }
            },
        }
    }

    get length() {
        return this.rows.length
    }

    forEach(callback: (row: TableRow, index: number, array: TableRow[]) => void) {
        this.rows.forEach(callback)
    }

    map(callback: (row: TableRow, index: number, array: TableRow[]) => any) {
        return this.rows.map(callback)
    }

    async more() {
        const {rows, more} = await this._more()
        this.rows = this.rows.concat(rows)
        this._more = more

        return this
    }
}
