import {mockSession} from '@wharfkit/mock-data'
import {assert} from 'chai'
import {makeClient} from '../utils/mock-client'
import {generateCodegenContract, removeCodegenContracts} from '$test/utils/codegen'
import {Contract} from '$lib'

let TokenContract

suite('session', function () {
    setup(async () => {
        const contract = Contract.from({
            name: 'eosio.token',
            client: makeClient('https://eos.greymass.com'),
        })
        const codegenPackage = await generateCodegenContract(contract)

        TokenContract = codegenPackage._EosioToken
    })

    teardown(() => {
        removeCodegenContracts()
    })

    test('action', async function () {
        const transferResponse = await TokenContract.actions.transfer(
            {
                from: 'foo',
                to: 'bar',
                quantity: '1.0000 EOS',
                memo: 'yeah!',
            },
            mockSession
        )
        assert.equal(
            String(transferResponse.request),
            'esr://gmMsfmIRpc7x7DpLh8nvg-zz9VdvrLYRihbJ-mIxXW5CYY4vA8OyJhPmVwahDAwM4bo2Z88yqDGAgUYshF5nKaAOYbG4-geDaNbK1MQMRSADAA'
        )
    })
})
