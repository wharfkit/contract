import {ABISerializableObject, Action, BytesType, Name, Session} from '@wharfkit/session'
import type {NameType, TransactOptions, TransactResult} from '@wharfkit/session'

export class Contract {
    /** Account where contract is deployed. */
    static account?: NameType

    private static _shared: Contract | null = null

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
        data: BytesType | ABISerializableObject | Record<string, any>,
        session: Session,
        transactOptions?: TransactOptions
    ): Promise<TransactResult> {
        const action: Action = Action.from({
            account: this.account,
            name,
            authorization: [session.permissionLevel],
            data,
        })

        // Trigger the transaction using the session kit
        return session.transact({action}, transactOptions)
    }
}
