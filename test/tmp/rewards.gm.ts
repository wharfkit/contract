import { Contract, Table, TableCursor, GetTableRowsOptions } from "../../src/index";
import { APIClient, Session, Struct, TransactResult, Asset, Checksum256, Float64, Name, TimePoint, TimePointSec, UInt128, UInt16, UInt32, UInt64, UInt8, AssetType, Checksum256Type, Float64Type, NameType, TimePointType, UInt128Type, UInt16Type, UInt32Type, UInt64Type, UInt8Type } from "@wharfkit/session";
export namespace _RewardsGm {
    export namespace actions {
        export function adduser(adduserParams: _RewardsGm.types.AdduserParams, session: Session): Promise<TransactResult> {
            const contract = Contract.from({ name: "rewards.gm" });
            return contract.call("adduser", _RewardsGm.types.Adduser.from(adduserParams), session);
        }
        export function claim(claimParams: _RewardsGm.types.ClaimParams, session: Session): Promise<TransactResult> {
            const contract = Contract.from({ name: "rewards.gm" });
            return contract.call("claim", _RewardsGm.types.Claim.from(claimParams), session);
        }
        export function configure(configureParams: _RewardsGm.types.ConfigureParams, session: Session): Promise<TransactResult> {
            const contract = Contract.from({ name: "rewards.gm" });
            return contract.call("configure", _RewardsGm.types.Configure.from(configureParams), session);
        }
        export function deluser(deluserParams: _RewardsGm.types.DeluserParams, session: Session): Promise<TransactResult> {
            const contract = Contract.from({ name: "rewards.gm" });
            return contract.call("deluser", _RewardsGm.types.Deluser.from(deluserParams), session);
        }
        export function receipt(receiptParams: _RewardsGm.types.ReceiptParams, session: Session): Promise<TransactResult> {
            const contract = Contract.from({ name: "rewards.gm" });
            return contract.call("receipt", _RewardsGm.types.Receipt.from(receiptParams), session);
        }
        export function updateuser(updateuserParams: _RewardsGm.types.UpdateuserParams, session: Session): Promise<TransactResult> {
            const contract = Contract.from({ name: "rewards.gm" });
            return contract.call("updateuser", _RewardsGm.types.Updateuser.from(updateuserParams), session);
        }
    }
}
export namespace _RewardsGm {
    export namespace tables {
        export class config {
            static fieldToIndex = { token_symbol: { type: "token_symbol", index_position: "primary" } };
            static where(queryParams: _RewardsGm.types.ConfigWhereQueryParams, getTableRowsOptions: GetTableRowsOptions, client: APIClient): TableCursor<_RewardsGm.types.Config> {
                const configTable = Table.from({ contract: Contract.from({ name: "rewards.gm", client: client }), name: "config", rowType: _RewardsGm.types.Config, fieldToIndex: config.fieldToIndex });
                return configTable.where(queryParams, getTableRowsOptions);
            }
            static find(queryParams: _RewardsGm.types.ConfigFindQueryParams, client: APIClient): Promise<_RewardsGm.types.Config> {
                const configTable = Table.from({ contract: Contract.from({ name: "rewards.gm", client: client }), name: "config", rowType: _RewardsGm.types.Config, fieldToIndex: config.fieldToIndex });
                return configTable.find(queryParams);
            }
            static first(limit: number, client: APIClient): TableCursor<_RewardsGm.types.Config> {
                const configTable = Table.from({ contract: Contract.from({ name: "rewards.gm", client: client }), name: "config", rowType: _RewardsGm.types.Config, fieldToIndex: config.fieldToIndex });
                return configTable.first(limit);
            }
        }
        export class users {
            static fieldToIndex = { account: { type: "account", index_position: "primary" } };
            static where(queryParams: _RewardsGm.types.UsersWhereQueryParams, getTableRowsOptions: GetTableRowsOptions, client: APIClient): TableCursor<_RewardsGm.types.User_row> {
                const usersTable = Table.from({ contract: Contract.from({ name: "rewards.gm", client: client }), name: "users", rowType: _RewardsGm.types.User_row, fieldToIndex: users.fieldToIndex });
                return usersTable.where(queryParams, getTableRowsOptions);
            }
            static find(queryParams: _RewardsGm.types.UsersFindQueryParams, client: APIClient): Promise<_RewardsGm.types.User_row> {
                const usersTable = Table.from({ contract: Contract.from({ name: "rewards.gm", client: client }), name: "users", rowType: _RewardsGm.types.User_row, fieldToIndex: users.fieldToIndex });
                return usersTable.find(queryParams);
            }
            static first(limit: number, client: APIClient): TableCursor<_RewardsGm.types.User_row> {
                const usersTable = Table.from({ contract: Contract.from({ name: "rewards.gm", client: client }), name: "users", rowType: _RewardsGm.types.User_row, fieldToIndex: users.fieldToIndex });
                return usersTable.first(limit);
            }
        }
    }
}
export namespace _RewardsGm {
    export namespace types {
        export interface AdduserParams {
            account: NameType;
            weight: UInt16Type;
        }
        export interface ClaimParams {
            account: NameType;
            amount: AssetType;
        }
        export interface ConfigureParams {
            token_symbol: Symbol;
            oracle_account: NameType;
            oracle_pairs: Oracle_pair;
        }
        export interface DeluserParams {
            account: NameType;
        }
        export interface ReceiptParams {
            account: NameType;
            amount: AssetType;
            ticker: Price_info;
        }
        export interface UpdateuserParams {
            account: NameType;
            weight: UInt16Type;
        }
        export interface ConfigWhereQueryParams {
            token_symbol?: {
                from: Symbol;
                to: Symbol;
            };
            oracle_account?: {
                from: NameType;
                to: NameType;
            };
            oracle_pairs?: {
                from: Oracle_pair;
                to: Oracle_pair;
            };
        }
        export interface ConfigFindQueryParams {
            token_symbol?: Symbol;
            oracle_account?: NameType;
            oracle_pairs?: Oracle_pair;
        }
        export interface UsersWhereQueryParams {
            account?: {
                from: NameType;
                to: NameType;
            };
            weight?: {
                from: UInt16Type;
                to: UInt16Type;
            };
            balance?: {
                from: AssetType;
                to: AssetType;
            };
        }
        export interface UsersFindQueryParams {
            account?: NameType;
            weight?: UInt16Type;
            balance?: AssetType;
        }
        @Struct.type("adduser")
        export class Adduser extends Struct {
            @Struct.field("name")
            declare account: Name;
            @Struct.field("uint16")
            declare weight: UInt16;
        }
        @Struct.type("claim")
        export class Claim extends Struct {
            @Struct.field("name")
            declare account: Name;
            @Struct.field("asset?")
            declare amount: Asset;
        }
        @Struct.type("config")
        export class Config extends Struct {
            @Struct.field("symbol")
            declare token_symbol: Symbol;
            @Struct.field("name")
            declare oracle_account: Name;
            @Struct.field("oracle_pair[]")
            declare oracle_pairs: _RewardsGm.types.Oracle_pair;
        }
        @Struct.type("configure")
        export class Configure extends Struct {
            @Struct.field("symbol")
            declare token_symbol: Symbol;
            @Struct.field("name")
            declare oracle_account: Name;
            @Struct.field("oracle_pair[]")
            declare oracle_pairs: _RewardsGm.types.Oracle_pair;
        }
        @Struct.type("deluser")
        export class Deluser extends Struct {
            @Struct.field("name")
            declare account: Name;
        }
        @Struct.type("oracle_pair")
        export class Oracle_pair extends Struct {
            @Struct.field("name")
            declare name: Name;
            @Struct.field("uint16")
            declare precision: UInt16;
        }
        @Struct.type("price_info")
        export class Price_info extends Struct {
            @Struct.field("string")
            declare pair: String;
            @Struct.field("float64")
            declare price: Float64;
            @Struct.field("time_point")
            declare timestamp: TimePoint;
        }
        @Struct.type("receipt")
        export class Receipt extends Struct {
            @Struct.field("name")
            declare account: Name;
            @Struct.field("asset")
            declare amount: Asset;
            @Struct.field("price_info[]")
            declare ticker: _RewardsGm.types.Price_info;
        }
        @Struct.type("updateuser")
        export class Updateuser extends Struct {
            @Struct.field("name")
            declare account: Name;
            @Struct.field("uint16")
            declare weight: UInt16;
        }
        @Struct.type("user_row")
        export class User_row extends Struct {
            @Struct.field("name")
            declare account: Name;
            @Struct.field("uint16")
            declare weight: UInt16;
            @Struct.field("asset")
            declare balance: Asset;
        }
    }
}
