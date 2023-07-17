import {TableCursor} from './index'
import {Struct} from '@wharfkit/session'
import type {APIClient, Name, UInt64} from '@wharfkit/session'
import {Contract} from './contract'
import {Table} from './contract/table'

export namespace _Blog {
    export namespace types {
        @Struct.type('users_row')
        export class UsersRow extends Struct {
            @Struct.field('id')
            declare id: UInt64
            @Struct.field('name')
            declare name: Name
            @Struct.field('email')
            declare email: string
        }

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

        export interface UsersFindQueryParams {
            name: string
            email: string
        }
    }
}

export namespace _Blog {
    export namespace tables {
        export class Users {
            static fieldToIndex = {
                name: {
                    type: 'name',
                    index_position: 'primary',
                },
                email: {
                    type: 'string',
                    index_position: 'secondary',
                },
            }

            static query(
                queryParams: _Blog.types.UsersQueryParams,
                {limit = 10} = {},
                client: APIClient
            ): TableCursor<_Blog.types.UsersRow> {
                const usersTable = Table.from({
                    contract: Contract.from({name: 'blog', client}),
                    name: 'users',
                    rowType: _Blog.types.UsersRow,
                    fieldToIndex: Users.fieldToIndex,
                })

                return usersTable.query(queryParams, {limit})
            }

            static async get(
                queryParams: _Blog.types.UsersFindQueryParams,
                client: APIClient
            ): Promise<_Blog.types.UsersRow> {
                const usersTable = Table.from({
                    contract: Contract.from({name: 'blog', client}),
                    name: 'users',
                    rowType: _Blog.types.UsersRow,
                    fieldToIndex: Users.fieldToIndex,
                })

                return usersTable.get(queryParams)
            }

            static first(limit, client): TableCursor<_Blog.types.UsersRow> {
                const usersTable = Table.from({
                    contract: Contract.from({name: 'blog', client}),
                    name: 'users',
                    rowType: _Blog.types.UsersRow,
                })

                return usersTable.first(limit)
            }
        }
    }

    export namespace actions {
        // Put actions here
    }
}
