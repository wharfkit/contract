import {ABI, ABIDef, APIClient, Name, NameType} from '@greymass/eosio'
import {ABICache} from '@wharfkit/session'
import type {ABICacheInterface} from '@wharfkit/session'
import {Contract} from './contract'

export interface ContractKitArgs {
    client: APIClient
}

export interface ABIDefinition {
    name: NameType
    abi: ABIDef
}

export interface ContractKitOptions {
    abiCache?: ABICacheInterface
    abis?: ABIDefinition[]
}

const defaultContractKitOptions: ContractKitOptions = {}

export class ContractKit {
    readonly abiCache: ABICacheInterface
    readonly client: APIClient

    constructor(args: ContractKitArgs, options: ContractKitOptions = defaultContractKitOptions) {
        // Use either the client given or get it from the session.
        if (args.client) {
            this.client = args.client
        } else {
            throw new Error('A `client` must be passed when initializing the ContractKit.')
        }

        // Use either the specified cache, the cache from the session, or create one
        if (options.abiCache) {
            this.abiCache = options.abiCache
        } else {
            this.abiCache = new ABICache(this.client)
        }

        // If any ABIs are provided during construction, inject them into the cache
        if (options.abis) {
            options.abis.forEach(({name, abi}) =>
                this.abiCache.setAbi(Name.from(name), ABI.from(abi))
            )
        }
    }

    /**
     * Load a contract by name from an API endpoint
     *
     * @param contract The name of the contract to load
     * @returns
     */
    async load(contract: NameType): Promise<Contract> {
        const account = Name.from(contract)
        const abiDef = await this.abiCache.getAbi(account)
        return new Contract({
            abi: ABI.from(abiDef),
            account,
            client: this.client,
        })
    }
}
