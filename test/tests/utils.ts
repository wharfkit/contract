import {assert} from 'chai'
import fs from 'fs'

import {ABI, Blob, Name, Serializer, UInt128, UInt64} from '@wharfkit/antelope'
import {
    abiToBlob,
    blobStringToAbi,
    capitalize,
    formatExceptionMessage,
    indexPositionInWords,
    pascalCase,
    singularize,
    wrapIndexValue,
} from '../../src/utils'

suite('Utility functions', function () {
    test('Converts to pascal case', function () {
        assert.equal(pascalCase('hello_world'), 'HelloWorld')
    })

    test('Capitalizes string', function () {
        assert.equal(capitalize('hello'), 'Hello')
        assert.equal(capitalize(''), '')
    })

    test('Singularizes word', function () {
        assert.equal(singularize('bodies'), 'body')
        assert.equal(singularize('watches'), 'watch')
        assert.equal(singularize('buses'), 'bus')
        assert.equal(singularize('cats'), 'cat')
    })

    test('Gets index position in words', function () {
        assert.equal(indexPositionInWords(0), 'primary')
        assert.equal(indexPositionInWords(1), 'secondary')
    })

    test('Wraps index value', function () {
        assert.isUndefined(wrapIndexValue(undefined))
        assert.deepEqual(wrapIndexValue(UInt128.from('10')), UInt128.from('10'))
        assert.deepEqual(wrapIndexValue(UInt64.from('10')), UInt64.from('10'))
        assert.deepEqual(wrapIndexValue(10), UInt64.from('10'))
        assert.deepEqual(wrapIndexValue('name'), Name.from('name'))
    })

    const testABI = ABI.from(fs.readFileSync(`test/data/abis/rewards.gm.json`, {encoding: 'utf8'}))

    // Blob created from the testABI
    const testBlob = new Blob(Serializer.encode({object: testABI, type: ABI}).array)

    test('Converts ABI to Blob', function () {
        const result = abiToBlob(testABI)
        assert(result.equals(testBlob))
    })

    test('Converts Blob string to ABI', function () {
        const blobString = String(testBlob)
        const result = blobStringToAbi(blobString)
        assert(result.equals(testABI))
    })

    test('Check round trip conversion from ABI to Blob and back', function () {
        const blob = abiToBlob(testABI)
        const blobString = String(blob)
        const result = blobStringToAbi(blobString)
        assert(result.equals(testABI))
    })

    suite('formatExceptionMessage', function () {
        test('substitutes ${key} placeholders from stack[0]', function () {
            const except: any = {
                code: 3050003,
                name: 'eosio_assert_message_exception',
                message: 'eosio_assert_message assertion failure',
                stack: [
                    {
                        context: {
                            level: 'error',
                            file: 'cf_system.cpp',
                            line: 14,
                            method: 'eosio_assert',
                        },
                        format: 'assertion failure with message: ${s}',
                        data: {s: 'container not found'},
                    },
                ],
            }
            assert.equal(
                formatExceptionMessage(except),
                'assertion failure with message: container not found'
            )
        })

        test('falls back to except.message when stack is empty', function () {
            const except: any = {
                code: 3080004,
                name: 'tx_cpu_usage_exceeded',
                message: 'transaction exceeded the current CPU usage limit',
                stack: [],
            }
            assert.equal(
                formatExceptionMessage(except),
                'transaction exceeded the current CPU usage limit'
            )
        })

        test('uses data.s when format is empty', function () {
            const except: any = {
                code: 3050003,
                name: 'eosio_assert_message_exception',
                message: 'eosio_assert_message assertion failure',
                stack: [{context: {}, format: '', data: {s: 'leftover string'}}],
            }
            assert.equal(formatExceptionMessage(except), 'leftover string')
        })

        test('leaves unmatched placeholders intact', function () {
            const except: any = {
                code: 1,
                name: 'whatever',
                message: 'fallback',
                stack: [{context: {}, format: 'oops ${missing}', data: {}}],
            }
            assert.equal(formatExceptionMessage(except), 'oops ${missing}')
        })
    })
})
