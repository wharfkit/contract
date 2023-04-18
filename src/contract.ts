import {
    Session,
    TransactResult,
    AnyAction,
    ABISerializableObject,
    Action,
    APIClient,
    Checksum256,
    Name,
    NameType,
    FetchProvider,
    ABI,
    Serializer
} from '@wharfkit/session'

// stubs for session kit
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
        data: ABISerializableObject | {[key: string]: any},
        session: Session
    ): Promise<TransactResult> {
        let action: Action

        // Add a RPC provider URL here
        const apiClient = new APIClient({provider: new FetchProvider(session.chain.url)})

        let serializedData: ABISerializableObject

        if (isABISerializableObject(data)) {
            serializedData = data
        } else {
            /// Fetch the ABI and construct the action
            const abi = await this._getAbi(apiClient)
            serializedData = await this._serializeActionData(abi, name, data)
        }

        action = Action.from({
            account: this.account,
            name,
            authorization: [],
            data: serializedData,
        })

        try {
            // Trigger the transaction using the session kit
            return session.transact({actions: [action]})
        } catch (error) {
            throw error
        }
    }

    private async _getAbi(apiClient): Promise<ABI> {
        const cachedAbi = this.constructor['cachedAbi']
        if (cachedAbi) {
            return cachedAbi
        } else {
            const abiResult = await apiClient.v1.chain.get_abi(this.account)
            this.constructor['cachedAbi'] = abiResult.abi
            return abiResult.abi
        }
    }

    private async _serializeActionData(
        abi: ABI,
        name: NameType,
        data: {[key: string]: any}
    ): Promise<ABISerializableObject> {
        const actionType = abi.actions.find((a) => a.name === name)?.type
        if (!actionType) {
            throw new Error(`Action '${name}' not found in ABI`)
        }

        return Serializer.encode({object: data, type: actionType})
    }
}
