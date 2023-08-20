import {ABI, APIClient, Name} from '@wharfkit/antelope'
import {makeClient} from '@wharfkit/mock-data'
import {assert} from 'chai'
import fs from 'fs'
import {Contract} from 'src/contract'

import * as MockRewardsGm from '$test/data/contracts/mock-rewards'
import {generateCodegenContract, removeCodegenContracts} from '$test/utils/codegen'
import {runGenericContractTests} from './generic'

const client = makeClient('https://eos.greymass.com')

suite('codegen', async function () {
    // Contract namespaces
    const contracts = {MockRewardsGm, GeneratedRewardsGm: null}

    // Source code files
    const files = {
        mock: fs.readFileSync('test/data/contracts/mock-rewards.ts').toString('utf-8'),
        generated: '',
    }

    let GeneratedRewardsGm

    setup(async function () {
        if (!GeneratedRewardsGm) {
            GeneratedRewardsGm = await generateCodegenContract('rewards.gm')
            contracts.GeneratedRewardsGm = GeneratedRewardsGm.import
            files.generated = GeneratedRewardsGm.text
        }
    })

    suite('Generated vs Static', function () {
        test('Contracts are identical', function () {
            assert.equal(files.generated, files.mock)
        })
        try {
            for (const contractKey of Object.keys(contracts)) {
                test(`Testing namespace ${contractKey}`, function () {
                    // The `RewardsGm` namespace
                    const testNamespace = contracts[contractKey].RewardsGm

                    // The `Contract` instance in the namespace
                    const testContract = testNamespace.Contract
                    const testContractInstance = new testContract({client})

                    // Run generic contract tests
                    runGenericContractTests(testContractInstance)

                    function assertRewardsContract(contract) {
                        assert.instanceOf(contract, Contract)
                        assert.instanceOf(contract.abi, ABI)
                        assert.isTrue(contract.abi.equals(testNamespace.abi))
                        assert.instanceOf(contract.account, Name)
                        assert.instanceOf(contract.client, APIClient)
                    }

                    assertRewardsContract(testContractInstance)

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
            }
        } catch (e) {
            console.log(e)
        }
    })
    teardown(() => {
        removeCodegenContracts()
    })
})
