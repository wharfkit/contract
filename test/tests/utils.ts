import {assert} from 'chai'
import fs from 'fs'

import {ABI, Blob, Int64, Name, Serializer, UInt128, UInt32, UInt64} from '@wharfkit/antelope'
import {
    abiToBlob,
    blobStringToAbi,
    capitalize,
    formatExceptionMessage,
    indexPositionInWords,
    isAbsentScope,
    pascalCase,
    singularize,
    wrapIndexValue,
    wrapScopeValue,
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

    suite('Wraps scope value', function () {
        test('names', function () {
            assert.deepEqual(wrapScopeValue(Name.from('teamgreymass')), Name.from('teamgreymass'))
        })

        test('strings pass through untouched', function () {
            assert.equal(wrapScopeValue('teamgreymass'), 'teamgreymass')
            assert.equal(wrapScopeValue('0'), '0')
            assert.equal(wrapScopeValue('18446744073709551615'), '18446744073709551615')
        })

        test('numbers', function () {
            assert.deepEqual(wrapScopeValue(0), UInt64.from(0))
            assert.deepEqual(wrapScopeValue(10), UInt64.from(10))
        })

        test('uint64 values beyond the range of a number', function () {
            const scope = UInt64.from('9223372036854775808')
            assert.deepEqual(wrapScopeValue(scope), scope)
            assert.equal(String(wrapScopeValue(scope)), '9223372036854775808')
        })

        test('rejects numbers that cannot hold the scope', function () {
            assert.throws(
                () => wrapScopeValue(9223372036854775808),
                /is not an integer a number can hold/
            )
            assert.throws(() => wrapScopeValue(1.5), /is not an integer a number can hold/)
        })

        test('rejects negative values', function () {
            assert.throws(() => wrapScopeValue(-1), /underflows uint64/)
            assert.throws(() => wrapScopeValue(Int64.from(-5)), /underflows uint64/)
        })

        test('accepts the full uint64 range', function () {
            const max = UInt64.from('18446744073709551615')
            assert.equal(String(wrapScopeValue(max)), '18446744073709551615')
        })

        test('accepts other integer types', function () {
            assert.deepEqual(wrapScopeValue(Int64.from(5)), UInt64.from(5))
            assert.deepEqual(wrapScopeValue(UInt32.from(7)), UInt64.from(7))
        })

        test('rejects an absent scope rather than exhausting memory', function () {
            assert.throws(() => wrapScopeValue(null as any), /Scope is required/)
            assert.throws(() => wrapScopeValue(undefined as any), /Scope is required/)
        })

        test('reports which scopes are absent', function () {
            assert.isTrue(isAbsentScope(undefined))
            assert.isTrue(isAbsentScope(null))
            assert.isTrue(isAbsentScope(''))
            assert.isFalse(isAbsentScope(0))
            assert.isFalse(isAbsentScope('teamgreymass'))
            assert.isFalse(isAbsentScope(UInt64.from(0)))
        })
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
