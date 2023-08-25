import {ABI, Blob, Name, Struct, UInt16, UInt32} from '@wharfkit/antelope'
import {Contract as BaseContract, ContractArgs, PartialBy} from '../../src/index'
export namespace Eosio {
    export const abiBlob = Blob.from(
        'DmVvc2lvOjphYmkvMS4yARdibG9ja19zaWduaW5nX2F1dGhvcml0eSJ2YXJpYW50X2Jsb2NrX3NpZ25pbmdfYXV0aG9yaXR5X3YwAhpibG9ja19zaWduaW5nX2F1dGhvcml0eV92MAACCXRocmVzaG9sZAZ1aW50MzIEa2V5cwxrZXlfd2VpZ2h0W10McmVncHJvZHVjZXIyAAQIcHJvZHVjZXIEbmFtZRJwcm9kdWNlcl9hdXRob3JpdHkXYmxvY2tfc2lnbmluZ19hdXRob3JpdHkDdXJsBnN0cmluZwhsb2NhdGlvbgZ1aW50MTYAAAAAAAEidmFyaWFudF9ibG9ja19zaWduaW5nX2F1dGhvcml0eV92MAEaYmxvY2tfc2lnbmluZ19hdXRob3JpdHlfdjA='
    )
    export const abi = ABI.from(abiBlob)
    export class Contract extends BaseContract {
        constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
            super({
                client: args.client,
                abi: abi,
                account: Name.from('eosio'),
            })
        }
    }
    export interface ActionNameParams {}
    export namespace ActionParams {}
    export namespace Types {
        @Struct.type('block_signing_authority_v0')
        export class BlockSigningAuthorityV0 extends Struct {
            @Struct.field(UInt32)
            threshold!: UInt32
            @Struct.field(KeyWeight, {array: true})
            keys!: KeyWeight[]
        }
        @Struct.type('regproducer2')
        export class Regproducer2 extends Struct {
            @Struct.field(Name)
            producer!: Name
            @Struct.field(Block_signing_authority)
            producer_authority!: Block_signing_authority
            @Struct.field('string')
            url!: string
            @Struct.field(UInt16)
            location!: UInt16
        }
    }
    const TableMap = {}
}
export default Eosio
