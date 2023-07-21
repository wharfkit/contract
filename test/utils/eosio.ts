// generated by @greymass/abi2core

import {
    Asset,
    BlockTimestamp,
    Bytes,
    Checksum256,
    Float64,
    Int64,
    Name,
    PublicKey,
    Struct,
    TimePoint,
    TimePointSec,
    TypeAlias,
    UInt128,
    UInt16,
    UInt32,
    UInt64,
    UInt8,
    Variant,
    VarUInt,
} from '@greymass/eosio'

@Struct.type('key_weight')
export class KeyWeight extends Struct {
    @Struct.field(PublicKey) key!: PublicKey
    @Struct.field(UInt16) weight!: UInt16
}

@Struct.type('block_signing_authority_v0')
export class BlockSigningAuthorityV0 extends Struct {
    @Struct.field(UInt32) threshold!: UInt32
    @Struct.field(KeyWeight, {array: true}) keys!: KeyWeight[]
}

@Variant.type('variant_block_signing_authority_v0', [BlockSigningAuthorityV0])
class VariantBlockSigningAuthorityV0 extends Variant {}

@TypeAlias('block_signing_authority')
class BlockSigningAuthority extends VariantBlockSigningAuthorityV0 {}

@Struct.type('abi_hash')
export class AbiHash extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Checksum256) hash!: Checksum256
}

@Struct.type('activate')
export class Activate extends Struct {
    @Struct.field(Checksum256) feature_digest!: Checksum256
}

@Struct.type('permission_level')
export class PermissionLevel extends Struct {
    @Struct.field(Name) actor!: Name
    @Struct.field(Name) permission!: Name
}

@Struct.type('permission_level_weight')
export class PermissionLevelWeight extends Struct {
    @Struct.field(PermissionLevel) permission!: PermissionLevel
    @Struct.field(UInt16) weight!: UInt16
}

@Struct.type('wait_weight')
export class WaitWeight extends Struct {
    @Struct.field(UInt32) wait_sec!: UInt32
    @Struct.field(UInt16) weight!: UInt16
}

@Struct.type('authority')
export class Authority extends Struct {
    @Struct.field(UInt32) threshold!: UInt32
    @Struct.field(KeyWeight, {array: true}) keys!: KeyWeight[]
    @Struct.field(PermissionLevelWeight, {array: true}) accounts!: PermissionLevelWeight[]
    @Struct.field(WaitWeight, {array: true}) waits!: WaitWeight[]
}

@Struct.type('bid_refund')
export class BidRefund extends Struct {
    @Struct.field(Name) bidder!: Name
    @Struct.field(Asset) amount!: Asset
}

@Struct.type('bidname')
export class Bidname extends Struct {
    @Struct.field(Name) bidder!: Name
    @Struct.field(Name) newname!: Name
    @Struct.field(Asset) bid!: Asset
}

@Struct.type('bidrefund')
export class Bidrefund extends Struct {
    @Struct.field(Name) bidder!: Name
    @Struct.field(Name) newname!: Name
}

@Struct.type('producer_key')
export class ProducerKey extends Struct {
    @Struct.field(Name) producer_name!: Name
    @Struct.field(PublicKey) block_signing_key!: PublicKey
}

@Struct.type('producer_schedule')
export class ProducerSchedule extends Struct {
    @Struct.field(UInt32) version!: UInt32
    @Struct.field(ProducerKey, {array: true}) producers!: ProducerKey[]
}

@Struct.type('block_header')
export class BlockHeader extends Struct {
    @Struct.field(UInt32) timestamp!: UInt32
    @Struct.field(Name) producer!: Name
    @Struct.field(UInt16) confirmed!: UInt16
    @Struct.field(Checksum256) previous!: Checksum256
    @Struct.field(Checksum256) transaction_mroot!: Checksum256
    @Struct.field(Checksum256) action_mroot!: Checksum256
    @Struct.field(UInt32) schedule_version!: UInt32
    @Struct.field(ProducerSchedule, {optional: true}) new_producers?: ProducerSchedule
}

@Struct.type('block_info_record')
export class BlockInfoRecord extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(UInt32) block_height!: UInt32
    @Struct.field(TimePoint) block_timestamp!: TimePoint
}

@Struct.type('blockchain_parameters')
export class BlockchainParameters extends Struct {
    @Struct.field(UInt64) max_block_net_usage!: UInt64
    @Struct.field(UInt32) target_block_net_usage_pct!: UInt32
    @Struct.field(UInt32) max_transaction_net_usage!: UInt32
    @Struct.field(UInt32) base_per_transaction_net_usage!: UInt32
    @Struct.field(UInt32) net_usage_leeway!: UInt32
    @Struct.field(UInt32) context_free_discount_net_usage_num!: UInt32
    @Struct.field(UInt32) context_free_discount_net_usage_den!: UInt32
    @Struct.field(UInt32) max_block_cpu_usage!: UInt32
    @Struct.field(UInt32) target_block_cpu_usage_pct!: UInt32
    @Struct.field(UInt32) max_transaction_cpu_usage!: UInt32
    @Struct.field(UInt32) min_transaction_cpu_usage!: UInt32
    @Struct.field(UInt32) max_transaction_lifetime!: UInt32
    @Struct.field(UInt32) deferred_trx_expiration_window!: UInt32
    @Struct.field(UInt32) max_transaction_delay!: UInt32
    @Struct.field(UInt32) max_inline_action_size!: UInt32
    @Struct.field(UInt16) max_inline_action_depth!: UInt16
    @Struct.field(UInt16) max_authority_depth!: UInt16
}

@Struct.type('blockchain_parameters_v1')
export class BlockchainParametersV1 extends BlockchainParameters {
    @Struct.field(UInt32, {extension: true}) max_action_return_value_size!: UInt32
}

@TypeAlias('blockchain_parameters_t')
class BlockchainParametersT extends BlockchainParametersV1 {}

@Struct.type('buyram')
export class Buyram extends Struct {
    @Struct.field(Name) payer!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(Asset) quant!: Asset
}

@Struct.type('buyrambytes')
export class Buyrambytes extends Struct {
    @Struct.field(Name) payer!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(UInt32) bytes!: UInt32
}

@Struct.type('buyrex')
export class Buyrex extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(Asset) amount!: Asset
}

@Struct.type('canceldelay')
export class Canceldelay extends Struct {
    @Struct.field(PermissionLevel) canceling_auth!: PermissionLevel
    @Struct.field(Checksum256) trx_id!: Checksum256
}

@Struct.type('powerup_config_resource')
export class PowerupConfigResource extends Struct {
    @Struct.field(Int64, {optional: true}) current_weight_ratio?: Int64
    @Struct.field(Int64, {optional: true}) target_weight_ratio?: Int64
    @Struct.field(Int64, {optional: true}) assumed_stake_weight?: Int64
    @Struct.field(TimePointSec, {optional: true}) target_timestamp?: TimePointSec
    @Struct.field(Float64, {optional: true}) exponent?: Float64
    @Struct.field(UInt32, {optional: true}) decay_secs?: UInt32
    @Struct.field(Asset, {optional: true}) min_price?: Asset
    @Struct.field(Asset, {optional: true}) max_price?: Asset
}

@Struct.type('powerup_config')
export class PowerupConfig extends Struct {
    @Struct.field(PowerupConfigResource) net!: PowerupConfigResource
    @Struct.field(PowerupConfigResource) cpu!: PowerupConfigResource
    @Struct.field(UInt32, {optional: true}) powerup_days?: UInt32
    @Struct.field(Asset, {optional: true}) min_powerup_fee?: Asset
}

@Struct.type('cfgpowerup')
export class Cfgpowerup extends Struct {
    @Struct.field(PowerupConfig) args!: PowerupConfig
}

@Struct.type('claimrewards')
export class Claimrewards extends Struct {
    @Struct.field(Name) owner!: Name
}

@Struct.type('closerex')
export class Closerex extends Struct {
    @Struct.field(Name) owner!: Name
}

@Struct.type('cnclrexorder')
export class Cnclrexorder extends Struct {
    @Struct.field(Name) owner!: Name
}

@Struct.type('connector')
export class Connector extends Struct {
    @Struct.field(Asset) balance!: Asset
    @Struct.field(Float64) weight!: Float64
}

@Struct.type('consolidate')
export class Consolidate extends Struct {
    @Struct.field(Name) owner!: Name
}

@Struct.type('defcpuloan')
export class Defcpuloan extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(UInt64) loan_num!: UInt64
    @Struct.field(Asset) amount!: Asset
}

@Struct.type('defnetloan')
export class Defnetloan extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(UInt64) loan_num!: UInt64
    @Struct.field(Asset) amount!: Asset
}

@Struct.type('delegatebw')
export class Delegatebw extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(Asset) stake_net_quantity!: Asset
    @Struct.field(Asset) stake_cpu_quantity!: Asset
    @Struct.field('bool') transfer!: boolean
}

@Struct.type('delegated_bandwidth')
export class DelegatedBandwidth extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(Name) to!: Name
    @Struct.field(Asset) net_weight!: Asset
    @Struct.field(Asset) cpu_weight!: Asset
}

@Struct.type('deleteauth')
export class Deleteauth extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Name) permission!: Name
    @Struct.field(Name, {extension: true}) authorized_by!: Name
}

@Struct.type('deposit')
export class Deposit extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Asset) amount!: Asset
}

@Struct.type('eosio_global_state')
export class EosioGlobalState extends BlockchainParameters {
    @Struct.field(UInt64) max_ram_size!: UInt64
    @Struct.field(UInt64) total_ram_bytes_reserved!: UInt64
    @Struct.field(Int64) total_ram_stake!: Int64
    @Struct.field(BlockTimestamp) last_producer_schedule_update!: BlockTimestamp
    @Struct.field(TimePoint) last_pervote_bucket_fill!: TimePoint
    @Struct.field(Int64) pervote_bucket!: Int64
    @Struct.field(Int64) perblock_bucket!: Int64
    @Struct.field(UInt32) total_unpaid_blocks!: UInt32
    @Struct.field(Int64) total_activated_stake!: Int64
    @Struct.field(TimePoint) thresh_activated_stake_time!: TimePoint
    @Struct.field(UInt16) last_producer_schedule_size!: UInt16
    @Struct.field(Float64) total_producer_vote_weight!: Float64
    @Struct.field(BlockTimestamp) last_name_close!: BlockTimestamp
}

@Struct.type('eosio_global_state2')
export class EosioGlobalState2 extends Struct {
    @Struct.field(UInt16) new_ram_per_block!: UInt16
    @Struct.field(BlockTimestamp) last_ram_increase!: BlockTimestamp
    @Struct.field(BlockTimestamp) last_block_num!: BlockTimestamp
    @Struct.field(Float64) total_producer_votepay_share!: Float64
    @Struct.field(UInt8) revision!: UInt8
}

@Struct.type('eosio_global_state3')
export class EosioGlobalState3 extends Struct {
    @Struct.field(TimePoint) last_vpay_state_update!: TimePoint
    @Struct.field(Float64) total_vpay_share_change_rate!: Float64
}

@Struct.type('eosio_global_state4')
export class EosioGlobalState4 extends Struct {
    @Struct.field(Float64) continuous_rate!: Float64
    @Struct.field(Int64) inflation_pay_factor!: Int64
    @Struct.field(Int64) votepay_factor!: Int64
}

@Struct.type('exchange_state')
export class ExchangeState extends Struct {
    @Struct.field(Asset) supply!: Asset
    @Struct.field(Connector) base!: Connector
    @Struct.field(Connector) quote!: Connector
}

@Struct.type('fundcpuloan')
export class Fundcpuloan extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(UInt64) loan_num!: UInt64
    @Struct.field(Asset) payment!: Asset
}

@Struct.type('fundnetloan')
export class Fundnetloan extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(UInt64) loan_num!: UInt64
    @Struct.field(Asset) payment!: Asset
}

@Struct.type('init')
export class Init extends Struct {
    @Struct.field(VarUInt) version!: VarUInt
    @Struct.field(Asset.Symbol) core!: Asset.Symbol
}

@Struct.type('limitauthchg')
export class Limitauthchg extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Name, {array: true}) allow_perms!: Name[]
    @Struct.field(Name, {array: true}) disallow_perms!: Name[]
}

@Struct.type('linkauth')
export class Linkauth extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Name) code!: Name
    @Struct.field(Name) type!: Name
    @Struct.field(Name) requirement!: Name
    @Struct.field(Name, {extension: true}) authorized_by!: Name
}

@Struct.type('mvfrsavings')
export class Mvfrsavings extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Asset) rex!: Asset
}

@Struct.type('mvtosavings')
export class Mvtosavings extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Asset) rex!: Asset
}

@Struct.type('name_bid')
export class NameBid extends Struct {
    @Struct.field(Name) newname!: Name
    @Struct.field(Name) high_bidder!: Name
    @Struct.field(Int64) high_bid!: Int64
    @Struct.field(TimePoint) last_bid_time!: TimePoint
}

@Struct.type('newaccount')
export class Newaccount extends Struct {
    @Struct.field(Name) creator!: Name
    @Struct.field(Name) name!: Name
    @Struct.field(Authority) owner!: Authority
    @Struct.field(Authority) active!: Authority
}

@Struct.type('onblock')
export class Onblock extends Struct {
    @Struct.field(BlockHeader) header!: BlockHeader
}

@Struct.type('onerror')
export class Onerror extends Struct {
    @Struct.field(UInt128) sender_id!: UInt128
    @Struct.field(Bytes) sent_trx!: Bytes
}

@Struct.type('pair_time_point_sec_int64')
export class PairTimePointSecInt64 extends Struct {
    @Struct.field(TimePointSec) first!: TimePointSec
    @Struct.field(Int64) second!: Int64
}

@Struct.type('powerup')
export class Powerup extends Struct {
    @Struct.field(Name) payer!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(UInt32) days!: UInt32
    @Struct.field(Int64) net_frac!: Int64
    @Struct.field(Int64) cpu_frac!: Int64
    @Struct.field(Asset) max_payment!: Asset
}

@Struct.type('powerup_order')
export class PowerupOrder extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(UInt64) id!: UInt64
    @Struct.field(Name) owner!: Name
    @Struct.field(Int64) net_weight!: Int64
    @Struct.field(Int64) cpu_weight!: Int64
    @Struct.field(TimePointSec) expires!: TimePointSec
}

@Struct.type('powerup_state_resource')
export class PowerupStateResource extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(Int64) weight!: Int64
    @Struct.field(Int64) weight_ratio!: Int64
    @Struct.field(Int64) assumed_stake_weight!: Int64
    @Struct.field(Int64) initial_weight_ratio!: Int64
    @Struct.field(Int64) target_weight_ratio!: Int64
    @Struct.field(TimePointSec) initial_timestamp!: TimePointSec
    @Struct.field(TimePointSec) target_timestamp!: TimePointSec
    @Struct.field(Float64) exponent!: Float64
    @Struct.field(UInt32) decay_secs!: UInt32
    @Struct.field(Asset) min_price!: Asset
    @Struct.field(Asset) max_price!: Asset
    @Struct.field(Int64) utilization!: Int64
    @Struct.field(Int64) adjusted_utilization!: Int64
    @Struct.field(TimePointSec) utilization_timestamp!: TimePointSec
}

@Struct.type('powerup_state')
export class PowerupState extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(PowerupStateResource) net!: PowerupStateResource
    @Struct.field(PowerupStateResource) cpu!: PowerupStateResource
    @Struct.field(UInt32) powerup_days!: UInt32
    @Struct.field(Asset) min_powerup_fee!: Asset
}

@Struct.type('powerupexec')
export class Powerupexec extends Struct {
    @Struct.field(Name) user!: Name
    @Struct.field(UInt16) max!: UInt16
}

@Struct.type('producer_info')
export class ProducerInfo extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Float64) total_votes!: Float64
    @Struct.field(PublicKey) producer_key!: PublicKey
    @Struct.field('bool') is_active!: boolean
    @Struct.field('string') url!: string
    @Struct.field(UInt32) unpaid_blocks!: UInt32
    @Struct.field(TimePoint) last_claim_time!: TimePoint
    @Struct.field(UInt16) location!: UInt16
    @Struct.field(BlockSigningAuthority, {extension: true})
    producer_authority!: BlockSigningAuthority
}

@Struct.type('producer_info2')
export class ProducerInfo2 extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Float64) votepay_share!: Float64
    @Struct.field(TimePoint) last_votepay_share_update!: TimePoint
}

@Struct.type('refund')
export class Refund extends Struct {
    @Struct.field(Name) owner!: Name
}

@Struct.type('refund_request')
export class RefundRequest extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(TimePointSec) request_time!: TimePointSec
    @Struct.field(Asset) net_amount!: Asset
    @Struct.field(Asset) cpu_amount!: Asset
}

@Struct.type('regproducer')
export class Regproducer extends Struct {
    @Struct.field(Name) producer!: Name
    @Struct.field(PublicKey) producer_key!: PublicKey
    @Struct.field('string') url!: string
    @Struct.field(UInt16) location!: UInt16
}

@Struct.type('regproducer2')
export class Regproducer2 extends Struct {
    @Struct.field(Name) producer!: Name
    @Struct.field(BlockSigningAuthority) producer_authority!: BlockSigningAuthority
    @Struct.field('string') url!: string
    @Struct.field(UInt16) location!: UInt16
}

@Struct.type('regproxy')
export class Regproxy extends Struct {
    @Struct.field(Name) proxy!: Name
    @Struct.field('bool') isproxy!: boolean
}

@Struct.type('rentcpu')
export class Rentcpu extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(Asset) loan_payment!: Asset
    @Struct.field(Asset) loan_fund!: Asset
}

@Struct.type('rentnet')
export class Rentnet extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(Asset) loan_payment!: Asset
    @Struct.field(Asset) loan_fund!: Asset
}

@Struct.type('rex_balance')
export class RexBalance extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(Name) owner!: Name
    @Struct.field(Asset) vote_stake!: Asset
    @Struct.field(Asset) rex_balance!: Asset
    @Struct.field(Int64) matured_rex!: Int64
    @Struct.field(PairTimePointSecInt64, {array: true}) rex_maturities!: PairTimePointSecInt64[]
}

@Struct.type('rex_fund')
export class RexFund extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(Name) owner!: Name
    @Struct.field(Asset) balance!: Asset
}

@Struct.type('rex_loan')
export class RexLoan extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(Name) from!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(Asset) payment!: Asset
    @Struct.field(Asset) balance!: Asset
    @Struct.field(Asset) total_staked!: Asset
    @Struct.field(UInt64) loan_num!: UInt64
    @Struct.field(TimePoint) expiration!: TimePoint
}

@Struct.type('rex_order')
export class RexOrder extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(Name) owner!: Name
    @Struct.field(Asset) rex_requested!: Asset
    @Struct.field(Asset) proceeds!: Asset
    @Struct.field(Asset) stake_change!: Asset
    @Struct.field(TimePoint) order_time!: TimePoint
    @Struct.field('bool') is_open!: boolean
}

@Struct.type('rex_pool')
export class RexPool extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(Asset) total_lent!: Asset
    @Struct.field(Asset) total_unlent!: Asset
    @Struct.field(Asset) total_rent!: Asset
    @Struct.field(Asset) total_lendable!: Asset
    @Struct.field(Asset) total_rex!: Asset
    @Struct.field(Asset) namebid_proceeds!: Asset
    @Struct.field(UInt64) loan_num!: UInt64
}

@Struct.type('rex_return_buckets')
export class RexReturnBuckets extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(PairTimePointSecInt64, {array: true}) return_buckets!: PairTimePointSecInt64[]
}

@Struct.type('rex_return_pool')
export class RexReturnPool extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(TimePointSec) last_dist_time!: TimePointSec
    @Struct.field(TimePointSec) pending_bucket_time!: TimePointSec
    @Struct.field(TimePointSec) oldest_bucket_time!: TimePointSec
    @Struct.field(Int64) pending_bucket_proceeds!: Int64
    @Struct.field(Int64) current_rate_of_increase!: Int64
    @Struct.field(Int64) proceeds!: Int64
}

@Struct.type('rexexec')
export class Rexexec extends Struct {
    @Struct.field(Name) user!: Name
    @Struct.field(UInt16) max!: UInt16
}

@Struct.type('rmvproducer')
export class Rmvproducer extends Struct {
    @Struct.field(Name) producer!: Name
}

@Struct.type('sellram')
export class Sellram extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Int64) bytes!: Int64
}

@Struct.type('sellrex')
export class Sellrex extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(Asset) rex!: Asset
}

@Struct.type('setabi')
export class Setabi extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Bytes) abi!: Bytes
    @Struct.field('string$') memo!: string
}

@Struct.type('setacctcpu')
export class Setacctcpu extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Int64, {optional: true}) cpu_weight?: Int64
}

@Struct.type('setacctnet')
export class Setacctnet extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Int64, {optional: true}) net_weight?: Int64
}

@Struct.type('setacctram')
export class Setacctram extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Int64, {optional: true}) ram_bytes?: Int64
}

@Struct.type('setalimits')
export class Setalimits extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Int64) ram_bytes!: Int64
    @Struct.field(Int64) net_weight!: Int64
    @Struct.field(Int64) cpu_weight!: Int64
}

@Struct.type('setcode')
export class Setcode extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(UInt8) vmtype!: UInt8
    @Struct.field(UInt8) vmversion!: UInt8
    @Struct.field(Bytes) code!: Bytes
    @Struct.field('string$') memo!: string
}

@Struct.type('setinflation')
export class Setinflation extends Struct {
    @Struct.field(Int64) annual_rate!: Int64
    @Struct.field(Int64) inflation_pay_factor!: Int64
    @Struct.field(Int64) votepay_factor!: Int64
}

@Struct.type('setparams')
export class Setparams extends Struct {
    @Struct.field(BlockchainParametersT) params!: BlockchainParametersT
}

@Struct.type('setpriv')
export class Setpriv extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(UInt8) is_priv!: UInt8
}

@Struct.type('setram')
export class Setram extends Struct {
    @Struct.field(UInt64) max_ram_size!: UInt64
}

@Struct.type('setramrate')
export class Setramrate extends Struct {
    @Struct.field(UInt16) bytes_per_block!: UInt16
}

@Struct.type('setrex')
export class Setrex extends Struct {
    @Struct.field(Asset) balance!: Asset
}

@Struct.type('undelegatebw')
export class Undelegatebw extends Struct {
    @Struct.field(Name) from!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(Asset) unstake_net_quantity!: Asset
    @Struct.field(Asset) unstake_cpu_quantity!: Asset
}

@Struct.type('unlinkauth')
export class Unlinkauth extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Name) code!: Name
    @Struct.field(Name) type!: Name
    @Struct.field(Name, {extension: true}) authorized_by!: Name
}

@Struct.type('unregprod')
export class Unregprod extends Struct {
    @Struct.field(Name) producer!: Name
}

@Struct.type('unstaketorex')
export class Unstaketorex extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Name) receiver!: Name
    @Struct.field(Asset) from_net!: Asset
    @Struct.field(Asset) from_cpu!: Asset
}

@Struct.type('updateauth')
export class Updateauth extends Struct {
    @Struct.field(Name) account!: Name
    @Struct.field(Name) permission!: Name
    @Struct.field(Name) parent!: Name
    @Struct.field(Authority) auth!: Authority
    @Struct.field(Name, {extension: true}) authorized_by!: Name
}

@Struct.type('updaterex')
export class Updaterex extends Struct {
    @Struct.field(Name) owner!: Name
}

@Struct.type('updtrevision')
export class Updtrevision extends Struct {
    @Struct.field(UInt8) revision!: UInt8
}

@Struct.type('user_resources')
export class UserResources extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Asset) net_weight!: Asset
    @Struct.field(Asset) cpu_weight!: Asset
    @Struct.field(Int64) ram_bytes!: Int64
}

@Struct.type('voteproducer')
export class Voteproducer extends Struct {
    @Struct.field(Name) voter!: Name
    @Struct.field(Name) proxy!: Name
    @Struct.field(Name, {array: true}) producers!: Name[]
}

@Struct.type('voter_info')
export class VoterInfo extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Name) proxy!: Name
    @Struct.field(Name, {array: true}) producers!: Name[]
    @Struct.field(Int64) staked!: Int64
    @Struct.field(Float64) last_vote_weight!: Float64
    @Struct.field(Float64) proxied_vote_weight!: Float64
    @Struct.field('bool') is_proxy!: boolean
    @Struct.field(UInt32) flags1!: UInt32
    @Struct.field(UInt32) reserved2!: UInt32
    @Struct.field(Asset) reserved3!: Asset
}

@Struct.type('voteupdate')
export class Voteupdate extends Struct {
    @Struct.field(Name) voter_name!: Name
}

@Struct.type('wasmcfg')
export class Wasmcfg extends Struct {
    @Struct.field(Name) settings!: Name
}

@Struct.type('withdraw')
export class Withdraw extends Struct {
    @Struct.field(Name) owner!: Name
    @Struct.field(Asset) amount!: Asset
}

@Struct.type('limit_auth_change')
export class LimitAuthChange extends Struct {
    @Struct.field(UInt8) version!: UInt8
    @Struct.field(Name) account!: Name
    @Struct.field(Name, {array: true}) allow_perms!: Name[]
    @Struct.field(Name, {array: true}) disallow_perms!: Name[]
}
