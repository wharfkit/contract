import {Struct, Name, Asset, Action} from '@wharfkit/session'

@Struct.type('transfer')
class Transfer extends Struct {
    @Struct.field('name') from!: Name
    @Struct.field('name') to!: Name
    @Struct.field('asset') quantity!: Asset
    @Struct.field('string') memo!: string
}

export function makeMockTransfer(transferData): Transfer {
    // Generate typed data for action data
    return Transfer.from(transferData)
}
