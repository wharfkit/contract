import * as fs from 'fs'
import * as path from 'path'
import {assert} from 'chai'
import {ABI, APIClient, Session} from '@wharfkit/session'
import {makeClient} from '@wharfkit/mock-data'

import {codegen} from '../../src/codegen' // replace with your actual codegen file
import { Contract } from 'src/contract'
import { generateCodegenContract, removeCodegenContracts } from '$test/utils/codegen'

let _RewardsGm

suite('codegen', function () {
    setup(async () => {
        const contractName = 'rewards.gm' // replace with your contract name

        const contractPackage = await generateCodegenContract(contractName)

        _RewardsGm = contractPackage._RewardsGm
    })

    teardown(() => {
        // Remove the 'test/tmp' directory and its contents after each run
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
