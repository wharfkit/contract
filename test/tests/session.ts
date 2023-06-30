import {_EosioToken as TokenContract} from '../data/contracts/token'
import {mockSession} from '@wharfkit/mock-data'

suite('session', function () {
    test('action', async function () {
        const test = await TokenContract.actions.transfer(
            {
                from: 'foo',
                to: 'bar',
                quantity: '1.0000 EOS',
                memo: 'yeah!',
            },
            mockSession
        )
        console.log(test)
    })
})
