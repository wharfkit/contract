import {assert} from 'chai'
import {makeClient} from '@wharfkit/mock-data'

import {generateCodegenContract, removeCodegenContracts} from '$test/utils/codegen'
import * as MockRewardsGm from '$test/data/contracts/mock-rewards'
import {Contract} from 'src/contract'
;(async function () {
    const GeneratedRewardsGm = await generateCodegenContract('rewards.gm')
    const contracts = {
        MockRewardsGm,
        GeneratedRewardsGm,
    }
    const client = makeClient('https://eos.greymass.com')

    suite('codegen', function () {
        test('Contracts are identical', function () {
            // TODO: We need a better way to compare the files too, like w/ imports etc
            assert.equal(
                JSON.stringify(contracts.MockRewardsGm),
                JSON.stringify(contracts.GeneratedRewardsGm)
            )
        })
        Object.keys(contracts).forEach((contractKey) => {
            suite(`Testing namespace ${contractKey}`, function () {
                // The `RewardsGm` namespace
                const testNamespace = contracts[contractKey].RewardsGm
                // The `Contract` instance in the namespace
                const testContract = testNamespace.Contract

                suite('Contract', function () {
                    test('valid instance', function () {
                        const contract = new testContract({client})
                        assert.instanceOf(contract, Contract)
                    })
                })
            })
        })
        teardown(() => {
            removeCodegenContracts()
        })
    })
})()
