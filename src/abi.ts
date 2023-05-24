import {APIClient} from '@greymass/eosio'

const eosClient = new APIClient({
    url: 'https://eos.greymass.com',
})

export async function fetchAbi(contract) {
    const {abi} = await eosClient.v1.chain.get_abi(contract)

    return abi
}
