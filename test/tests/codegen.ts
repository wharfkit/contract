import {assert} from 'chai'
import {ABI, APIClient, Name} from '@wharfkit/antelope'
import {makeClient} from '@wharfkit/mock-data'

import {Contract} from 'src/contract'

import * as MockRewardsGm from '$test/data/contracts/mock-rewards'
import {generateCodegenContract, removeCodegenContracts} from '$test/utils/codegen'
import {runGenericContractTests} from './contract'
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
                const testContractInstance = new testContract({client})

                function assertRewardsContract(contract) {
                    assert.instanceOf(contract, Contract)
                    assert.instanceOf(contract.abi, ABI)
                    assert.isTrue(contract.abi.equals(testNamespace.abi))
                    assert.instanceOf(contract.account, Name)
                    assert.instanceOf(contract.client, APIClient)
                }

                suite('Contract', function () {
                    suite('constructor', function () {
                        test('default', function () {
                            const contract = new testContract({client})
                            assertRewardsContract(contract)
                        })
                        test('accepted variants', function () {
                            const c1 = new testContract({client})
                            assertRewardsContract(c1)
                            const c2 = new testContract({client, abi: testNamespace.abi})
                            assertRewardsContract(c2)
                            const c3 = new testContract({client, account: 'teamgreymass'})
                            assertRewardsContract(c3)
                            const c4 = new testContract({
                                client,
                                account: Name.from('teamgreymass'),
                            })
                            assertRewardsContract(c4)
                            const c5 = new testContract({
                                client,
                                abi: testNamespace.abi,
                                account: 'teamgreymass',
                            })
                            assertRewardsContract(c5)
                        })
                        test('invalid variants', function () {
                            assert.throws(() => new testContract({abi: testNamespace.abi}))
                            assert.throws(
                                () =>
                                    new testContract({
                                        abi: testNamespace.abi,
                                        account: 'teamgreymass',
                                    })
                            )
                            assert.throws(() => new testContract({account: 'teamgreymass'}))
                        })
                    })
                    runGenericContractTests(testContractInstance)
                })
            })
        })
        teardown(() => {
            removeCodegenContracts()
        })
    })
})()
