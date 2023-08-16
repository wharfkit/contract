import {ABIDef, Action, ActionType, AnyAction} from '@wharfkit/antelope'

export class ContractAction extends Action {
    static from<T>(object: ActionType | AnyAction, abi?: ABIDef): T {
        return super.from(object, abi) as T
    }
}
