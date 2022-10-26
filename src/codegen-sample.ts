import {AssetType, Name, NameType, Struct} from '@greymass/eosio'

import {Contract} from './contract'

class contractImpl extends Contract {
    static account = Name.from('rewards.gm')

    async claim(account: NameType, amount?: AssetType) {
        return this.call('claim', contractImpl.Types.Claim.from({account, amount}))
    }
}

namespace contractImpl {
    export namespace Types {
        @Struct.type('claim')
        export class Claim extends Struct {
            @Struct.field('name') declare account: Name
            @Struct.field('asset') declare amount?: AssetType
        }
    }
}

export default contractImpl
