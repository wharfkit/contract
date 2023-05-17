import chai from 'chai'
const expect = chai.expect

import {Contract} from '../src/contract'
import {APIClient} from '@greymass/eosio'
import {MockProvider} from './utils/mock-provider'

describe('getTableRows', () => {
    let mockProvider
    let mockClient
    let mockContract

    beforeEach(() => {
        mockProvider = new MockProvider()
        mockClient = new APIClient({provider: mockProvider})
        mockContract = new Contract({
            account: 'eosio.forums',
            client: mockClient,
        })
    })

    it('should fetch table rows correctly with default options', async () => {
        const cursor = await mockContract.getTableRows('proposal')

        expect(cursor).to.be.instanceOf(TableCursor)
        expect([...cursor]).to.deep.equal([
            {id: 1, title: 'Proposal 1', content: 'Proposal 1 content'},
            // ... more mock rows
        ])
    })

    it('should fetch table rows correctly with custom options', async () => {
        const cursor = await getTableRows('customTable', {
            scope: 'customScope',
            json: false,
            start: '10',
            end: '20',
            limit: 50,
            index: 2,
            indexType: 'i64',
        })

        expect(cursor).to.be.instanceOf(TableCursor)
        expect([...cursor]).to.deep.equal([
            {id: 1, title: 'Proposal 1', content: 'Proposal 1 content'},
            // ... more mock rows
        ])
    })
})
