import {
    ABI,
    ABIDef,
    ABISerializable,
    ABISerializableConstructor,
    ABISerializableType,
    Action,
    ActionType,
    AnyAction,
    Bytes,
    Serializer,
} from '@greymass/eosio'

export class ContractAction extends Action {
    readonly abi: ABI
    readonly action: Action

    constructor(args) {
        super(args.action)
        this.abi = args.abi
        this.action = args.action
    }

    static from(object: ActionType | AnyAction, abi: ABIDef): ContractAction {
        const data = object.data as any
        if (!Bytes.isBytes(data)) {
            let type: string | undefined
            if (abi) {
                type = ABI.from(abi).getActionType(object.name)
            } else if (!data.constructor || data.constructor.abiName === undefined) {
                throw new Error(
                    'Missing ABI definition when creating action with untyped action data'
                )
            }
            object = {
                ...object,
                data: Serializer.encode({object: data, type, abi}),
            }
        }
        return new this({
            abi: ABI.from(abi),
            action: Action.from(object),
        })
    }

    equals(other: ActionType | AnyAction) {
        return Action.from(other).equals(this.action)
    }

    decodeData<T extends ABISerializableConstructor>(type: T): InstanceType<T>
    decodeData(abi: ABIDef): ABISerializable
    decodeData(typeOrAbi: ABISerializableType | ABIDef) {
        if (typeof typeOrAbi === 'string' || (typeOrAbi as ABISerializableConstructor).abiName) {
            return Serializer.decode({
                data: this.action.data,
                type: typeOrAbi as string,
            })
        } else {
            const abi = ABI.from(typeOrAbi as ABIDef)
            const type = abi.getActionType(this.action.name)
            if (!type) {
                throw new Error(`Action ${this.action.name} does not exist in provided ABI`)
            }
            return Serializer.decode({data: this.action.data, type, abi})
        }
    }
}
