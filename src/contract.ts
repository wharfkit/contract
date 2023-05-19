import {
    ABISerializableObject,
    Action,
    Name,
    NameType,
    Session,
    TransactResult,
} from '@wharfkit/session'
import type {APIClient} from '@wharfkit/session'

export interface ContractOptions {
    account?: NameType
    client?: APIClient
}

export class Contract {
    private static _shared: Contract | null = null
    private static account: Name

    private client: APIClient | undefined

    /** Account where contract is deployed. */
    readonly account: Name

    constructor(options?: ContractOptions) {
        if ((this.constructor as typeof Contract).account) {
            if (options?.account) {
                throw new Error('Cannot specify account when using subclassed Contract')
            }
            this.account = Name.from((this.constructor as any).account!)
        } else {
            if (!options?.account) {
                throw new Error('Must specify account when using Contract directly')
            }
            this.account = Name.from(options?.account)
        }

        if (options?.client) {
            this.client = options.client
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
        const action: Action = Action.from({
            account: this.account,
            name,
            authorization: [],
            data,
        })

        // Trigger the transaction using the session kit
        return session.transact({action})
    }
}
