import {makeClient, mockSession} from '@wharfkit/mock-data'

import ContractKit, {Contract} from '$lib'
import {Action} from '@greymass/eosio'
import {TransactABIDef} from '@wharfkit/session'

const mockClient = makeClient('https://jungle4.greymass.com')

suite('Session', () => {
    let mockKit: ContractKit
    let tokenContract: Contract

    setup(async function () {
        mockKit = new ContractKit({
            client: mockClient,
        })
        tokenContract = await mockKit.load('eosio.token')
    })

    suite('transact', function () {
        test('passes abi data', async function () {
            // Action to perform
            const action: Action = tokenContract.action('transfer', {
                from: 'foo',
                to: 'bar',
                quantity: '10.0000 EOS',
                memo: '',
            })
            // ABIs to perform the transaction
            const abis: TransactABIDef[] = [
                {
                    account: tokenContract.account,
                    abi: tokenContract.abi,
                },
            ]
            // Passing data to transact
            await mockSession.transact(
                {
                    action,
                },
                {
                    abis,
                }
            )
        })
    })
})
