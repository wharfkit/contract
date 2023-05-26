import {Contract, TableCursor} from './index'
import {Name, NameType} from '@wharfkit/session'

const queryFields = ['name', 'email', 'id', 'title']

export class _Blog extends Contract {
    async where(
        table: NameType,
        queryParams: _Blog.Types.UsersQueryParams & _Blog.Types.ProposalsQueryParams,
        {limit = 10} = {}
    ) {
        let lowerBound
        let upperBound
        let indexPosition

        let fieldFound = false

        for (let field of queryFields) {
            if (queryParams[field]) {
                const {from, to} = queryParams[field]
                lowerBound = from
                upperBound = to
                indexPosition = getIndexPosition(table, field)
                fieldFound = true
                break
            }
        }

        const tableRowsOptions = {
            table,
            code: this.account,
            lower_bound: lowerBound && Name.from(lowerBound),
            upper_bound: upperBound && Name.from(upperBound),
            scope: table,
            limit,
            index_position: indexPosition,
        }

        const {rows, next_key} = await this.getTableRows(tableRowsOptions)

        return new TableCursor({
            rows,
            contract: this,
            table,
            options: tableRowsOptions,
            next_key: String(next_key),
        })
    }

    async find(
        table: NameType,
        queryParams: _Blog.Types.UsersFindParams & _Blog.Types.ProposalsFindParams
    ) {
        let lowerBound
        let upperBound
        let indexPosition

        let fieldFound = false

        for (let field of queryFields) {
            if (queryParams[field]) {
                lowerBound = queryParams[field]
                upperBound = queryParams[field]
                indexPosition = getIndexPosition(table, field)
                fieldFound = true
                break
            }
        }

        const tableRowsOptions = {
            table,
            code: this.account,
            scope: table,
            lower_bound: Name.from(lowerBound),
            upper_bound: Name.from(upperBound),
            limit: 1,
            index_position: getIndexPosition(table, 'name'),
        }

        const {rows} = await this.getTableRows(tableRowsOptions)

        return rows[0]
    }

    async all(table, {limit}) {
        const tableRowsOptions = {
            table,
            code: this.account,
            scope: 'users',
            limit,
        }

        const {rows, next_key} = await this.getTableRows(tableRowsOptions)

        return new TableCursor({
            rows,
            contract: this,
            table,
            options: tableRowsOptions,
            next_key: String(next_key),
        })
    }
}
export namespace _Blog {
    export namespace Types {
        export interface UsersQueryParams {
            name: {
                from: string
                to: string
            }
            email: {
                from: string
                to: string
            }
        }

        export interface UsersFindParams {
            name: string
            email: string
        }

        export interface ProposalsQueryParams {
            id: {
                from: number
                to: number
            }
            title: {
                from: string
                to: string
            }
        }

        export interface ProposalsFindParams {
            id: number
            title: string
        }
    }
}

function getIndexPosition(table, keyName) {
    return {
        users: {
            name: 'primary',
            email: 'secondary',
        },
        propsals: {
            id: 'primary',
            title: 'secondary',
        },
    }[table][keyName]
}
