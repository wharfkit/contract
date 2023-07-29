import {Contract as BaseContract, blobStringToAbi, ContractArgs} from '@wharfkit/contract'
import {
    ABI,
    APIClient,
    Asset,
    AssetType,
    Blob,
    Checksum256,
    Checksum256Type,
    Float64,
    Float64Type,
    Name,
    NameType,
    Session,
    Struct,
    TimePoint,
    TimePointSec,
    TimePointType,
    TransactResult,
    UInt128,
    UInt128Type,
    UInt16,
    UInt16Type,
    UInt32,
    UInt32Type,
    UInt64,
    UInt64Type,
    UInt8,
    UInt8Type,
} from '@wharfkit/session'
export namespace RewardsGm {
    export const abiBlob = Blob.from(
        'DmVvc2lvOjphYmkvMS4yAAoHYWRkdXNlcgACB2FjY291bnQEbmFtZQZ3ZWlnaHQGdWludDE2BWNsYWltAAIHYWNjb3VudARuYW1lBmFtb3VudAZhc3NldD8GY29uZmlnAAMMdG9rZW5fc3ltYm9sBnN5bWJvbA5vcmFjbGVfYWNjb3VudARuYW1lDG9yYWNsZV9wYWlycw1vcmFjbGVfcGFpcltdCWNvbmZpZ3VyZQADDHRva2VuX3N5bWJvbAZzeW1ib2wOb3JhY2xlX2FjY291bnQEbmFtZQxvcmFjbGVfcGFpcnMNb3JhY2xlX3BhaXJbXQdkZWx1c2VyAAEHYWNjb3VudARuYW1lC29yYWNsZV9wYWlyAAIEbmFtZQRuYW1lCXByZWNpc2lvbgZ1aW50MTYKcHJpY2VfaW5mbwADBHBhaXIGc3RyaW5nBXByaWNlB2Zsb2F0NjQJdGltZXN0YW1wCnRpbWVfcG9pbnQHcmVjZWlwdAADB2FjY291bnQEbmFtZQZhbW91bnQFYXNzZXQGdGlja2VyDHByaWNlX2luZm9bXQp1cGRhdGV1c2VyAAIHYWNjb3VudARuYW1lBndlaWdodAZ1aW50MTYIdXNlcl9yb3cAAwdhY2NvdW50BG5hbWUGd2VpZ2h0BnVpbnQxNgdiYWxhbmNlBWFzc2V0BgAAAOAqrFMyB2FkZHVzZXKVAi0tLQpzcGVjX3ZlcnNpb246ICIwLjIuMCIKdGl0bGU6IEFkZCB1c2VyCnN1bW1hcnk6ICdBZGQgbmV3IHVzZXIge3tub3dyYXAgYWNjb3VudH19JwppY29uOiBodHRwczovL2FsbW9zdC5kaWdpdGFsL2ltYWdlcy9taXNjX2ljb24ucG5nIzZmNWVhOTc4YjA0ZDAzZTAxOGIzNzlhMmJhYzRjMTBiNWE4ZmUwY2Q1ZTZlMTVjODg4MjhkYzk4NmJlOTZjZmYKLS0tCgp7e2FjY291bnR9fSBpcyBhZGRlZCB0byB0aGUgcmV3YXJkcyBzaGFyaW5nIGxpc3Qgd2l0aCB3ZWlnaHQge3t3ZWlnaHR9fS4AAAAAAOlMRAVjbGFpbfYCLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogQ2xhaW0Kc3VtbWFyeTogJ0NsYWltIHJld2FyZHMgZm9yIHt7bm93cmFwIGFjY291bnR9fScKaWNvbjogaHR0cHM6Ly9hbG1vc3QuZGlnaXRhbC9pbWFnZXMvY2xhaW1faWNvbi5wbmcjYmI1OTdmNGFjYzEzMDU5MjU5MTJlMThlN2I0Y2Y3MDhkMWZhZWMyYWE4OGI3YTUzZDg3OTY5ZTA0NTE2OGVjZgotLS0KCnt7I2lmX2hhc192YWx1ZSBhbW91bnR9fQogICAge3thY2NvdW50fX0gY2xhaW1zIHt7YW1vdW50fX0gZnJvbSB0aGVpciByZXdhcmRzIGJhbGFuY2UuCnt7ZWxzZX19CiAgICB7e2FjY291bnR9fSBjbGFpbXMgdGhlaXIgZW50aXJlIHJld2FyZHMgYmFsYW5jZS4Ke3svaWZfaGFzX3ZhbHVlfX0AAFBXM7cmRQljb25maWd1cmUAAAAA4Cqso0oHZGVsdXNlcsQCLS0tCnNwZWNfdmVyc2lvbjogIjAuMi4wIgp0aXRsZTogRGVsZXRlIHVzZXIKc3VtbWFyeTogJ0RlbGV0ZSB1c2VyIHt7bm93cmFwIGFjY291bnR9fScKaWNvbjogaHR0cHM6Ly9hbG1vc3QuZGlnaXRhbC9pbWFnZXMvbWlzY19pY29uLnBuZyM2ZjVlYTk3OGIwNGQwM2UwMThiMzc5YTJiYWM0YzEwYjVhOGZlMGNkNWU2ZTE1Yzg4ODI4ZGM5ODZiZTk2Y2ZmCi0tLQoKe3thY2NvdW50fX0gaXMgaXMgcmVtb3ZlZCBmcm9tIHRoZSByZXdhcmRzIHNoYXJpbmcgbGlzdC4KClVzZXJzIGNhbiBvbmx5IGJlIHJlbW92ZWQgaWYgdGhlaXIgcmV3YXJkcyBiYWxhbmNlIGlzIHplcm8uAAAAIFenkLoHcmVjZWlwdAAAwFVYq2xS1Qp1cGRhdGV1c2VygAItLS0Kc3BlY192ZXJzaW9uOiAiMC4yLjAiCnRpdGxlOiBVcGRhdGUgdXNlcgpzdW1tYXJ5OiAnVXBkYXRlIHVzZXIge3tub3dyYXAgYWNjb3VudH19JwppY29uOiBodHRwczovL2FsbW9zdC5kaWdpdGFsL2ltYWdlcy9taXNjX2ljb24ucG5nIzZmNWVhOTc4YjA0ZDAzZTAxOGIzNzlhMmJhYzRjMTBiNWE4ZmUwY2Q1ZTZlMTVjODg4MjhkYzk4NmJlOTZjZmYKLS0tCgp7e2FjY291bnR9fSBpcyB1cGRhdGVkIHRvIGhhdmUgd2VpZ2h0IHt7d2VpZ2h0fX0uAgAAAAAwtyZFA2k2NAAABmNvbmZpZwAAAAAAfBXWA2k2NAAACHVzZXJfcm93AAAAAA=='
    )
    export const abi = ABI.from(abiBlob)
    export class Contract extends BaseContract {
        constructor(args: Omit<ContractArgs, 'abi' | 'account'>) {
            super({
                client: args.client,
                abi: abi,
                account: Name.from('rewards.gm'),
            })
        }
    }
    export namespace types {
        @Struct.type('adduser')
        export class Adduser extends Struct {
            @Struct.field('name')
            declare account: Name
            @Struct.field('uint16')
            declare weight: UInt16
        }
        @Struct.type('claim')
        export class Claim extends Struct {
            @Struct.field('name')
            declare account: Name
            @Struct.field('asset?')
            declare amount: Asset
        }
        @Struct.type('config')
        export class Config extends Struct {
            @Struct.field('symbol')
            declare token_symbol: symbol
            @Struct.field('name')
            declare oracle_account: Name
            @Struct.field('oracle_pair[]')
            declare oracle_pairs: RewardsGm.types.Oracle_pair
        }
        @Struct.type('configure')
        export class Configure extends Struct {
            @Struct.field('symbol')
            declare token_symbol: symbol
            @Struct.field('name')
            declare oracle_account: Name
            @Struct.field('oracle_pair[]')
            declare oracle_pairs: RewardsGm.types.Oracle_pair
        }
        @Struct.type('deluser')
        export class Deluser extends Struct {
            @Struct.field('name')
            declare account: Name
        }
        @Struct.type('oracle_pair')
        export class Oracle_pair extends Struct {
            @Struct.field('name')
            declare name: Name
            @Struct.field('uint16')
            declare precision: UInt16
        }
        @Struct.type('price_info')
        export class Price_info extends Struct {
            @Struct.field('string')
            declare pair: string
            @Struct.field('float64')
            declare price: Float64
            @Struct.field('time_point')
            declare timestamp: TimePoint
        }
        @Struct.type('receipt')
        export class Receipt extends Struct {
            @Struct.field('name')
            declare account: Name
            @Struct.field('asset')
            declare amount: Asset
            @Struct.field('price_info[]')
            declare ticker: RewardsGm.types.Price_info
        }
        @Struct.type('updateuser')
        export class Updateuser extends Struct {
            @Struct.field('name')
            declare account: Name
            @Struct.field('uint16')
            declare weight: UInt16
        }
        @Struct.type('user_row')
        export class User_row extends Struct {
            @Struct.field('name')
            declare account: Name
            @Struct.field('uint16')
            declare weight: UInt16
            @Struct.field('asset')
            declare balance: Asset
        }
    }
}
