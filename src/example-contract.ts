import {TableCursor} from './index'
import {Struct} from '@wharfkit/session'
import type {APIClient, UInt64, Name} from '@wharfkit/session'
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

            static where(
                queryParams: _Blog.types.UsersQueryParams & _Blog.types.ProposalsQueryParams,
                {limit = 10} = {},
                client: APIClient
            ): Promise<TableCursor<_Blog.types.UsersRow>> {
                const usersTable = Table.from({
                    account: 'blog',
                    table: 'users',
                    client,
                    tableStruct: _Blog.types.UsersRow,
                })

                return usersTable.where(Users.fieldToIndex, queryParams, {limit})
            }

            static async find(
                queryParams: _Blog.types.UsersFindParams & _Blog.types.ProposalsFindParams,
                client: APIClient
            ): Promise<_Blog.types.UsersRow> {
                const usersTable = Table.from({
                    account: 'blog',
                    table: 'users',
                    client,
                    tableStruct: _Blog.types.UsersRow,
                })

                return usersTable.find(Users.fieldToIndex, queryParams)
            }

            static async all({limit}, client): Promise<TableCursor<_Blog.types.UsersRow>> {
                const usersTable = Table.from({
                    account: 'blog',
                    table: 'users',
                    client,
                    tableStruct: _Blog.types.UsersRow,
                })

                return usersTable.all({limit})
            }
        }
    }

    export namespace actions {
        // Put actions here
    }
}
