import {
    ABISerializableObject,
    Action,
    AnyAction,
    Checksum256,
    Name,
    NameType,
} from '@greymass/eosio'

// stubs for session kit
interface Session {
    transact(SessionTransactArgs: any): Promise<SessionTransactResult>
}
interface SessionTransactArgs {
    actions: AnyAction[]
}
interface SessionTransactResult {
    id: Checksum256
}

// TODO: move this to core
export function isABISerializableObject(value: any): value is ABISerializableObject {
    return value.constructor && typeof value.constructor.abiName === 'string'
}

export class Contract {
    /** Account where contract is deployed. */
    static account?: NameType

    private static _shared: Contract | null = null
    private static _session: Session | null = null

    /** Account where contract is deployed. */
    readonly account: Name

    constructor(account?: NameType) {
        if ((this.constructor as typeof Contract).account) {
            if (account) {
                throw new Error('Cannot specify account when using subclassed Contract')
            }
            this.account = Name.from((this.constructor as typeof Contract).account!)
        } else {
            if (!account) {
                throw new Error('Must specify account when using Contract directly')
            }
            this.account = Name.from(account)
        }
    }

    /** Shared instance of the contract. */
    static shared<T extends {new ()}>(this: T): InstanceType<T> {
        const self = this as unknown as typeof Contract
        if (!self._shared) {
            self._shared = new self()
        }
        return self._shared as InstanceType<T>
    }

    /** Call a contract action. */
    async call(
        name: NameType,
        data: ABISerializableObject | {[key: string]: any}
    ): Promise<SessionTransactResult> {
        let action: Action
        if (isABISerializableObject(data)) {
            action = Action.from({
                account: this.account,
                name,
                authorization: [],
                data,
            })
        } else {
            // TODO: here we need to fetch the ABI and construct the action
            throw new Error('Not implemented')
        }
        // TODO: resolve session and transact
        throw new Error('Not implemented')
    }
}
