import {assert} from 'chai'
import {APIClient} from '@wharfkit/session'
import {makeClient} from '@wharfkit/mock-data'

import {Contract} from 'src/contract'
import {generateCodegenContract, removeCodegenContracts} from '$test/utils/codegen'

let _RewardsGm

suite('codegen', function () {
    setup(async () => {
        const contractName = 'rewards.gm'

        const contractPackage = await generateCodegenContract(contractName)

        _RewardsGm = contractPackage._RewardsGm
    })

    teardown(() => {
        removeCodegenContracts()
    })

    suite('_RewardsGm', function () {
        let client: APIClient

        // Setup before each test
        setup(function () {
            client = makeClient('https://eos.greymass.com')
        })

        suite('constructor', function () {
            test('constructs the Contract instance', async function () {
                const rewardsContract = new _RewardsGm({client})

                assert.instanceOf(rewardsContract, Contract)
            })
        })
    })
})
