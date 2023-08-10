import {ABI, APIClient, Name} from '@wharfkit/antelope'
import {makeClient} from '@wharfkit/mock-data'
import {assert} from 'chai'
import fs from 'fs'
import {Contract} from 'src/contract'

import * as MockRewardsGm from '$test/data/contracts/mock-rewards'
import {generateCodegenContract, removeCodegenContracts} from '$test/utils/codegen'
import {runGenericContractTests} from './contract'
;(async function () {
    const GeneratedRewardsGm = await generateCodegenContract('rewards.gm')
    const contracts = {
        MockRewardsGm,
        GeneratedRewardsGm: GeneratedRewardsGm.import,
    }

    const files = {
        mock: fs.readFileSync('test/data/contracts/mock-rewards.ts').toString('utf-8'),
        generated: GeneratedRewardsGm.text,
    }

    const client = makeClient('https://eos.greymass.com')

    suite('codegen', function () {
        test('Contracts are identical', function () {
            assert.equal(files.mock, files.generated)
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
