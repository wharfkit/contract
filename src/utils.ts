import {
    ABI,
    API,
    Blob,
    Checksum160,
    Checksum256,
    Float64,
    isInstanceOf,
    Name,
    NameType,
    Serializer,
    UInt128,
    UInt64,
    UInt64Type,
} from '@wharfkit/antelope'

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** A table scope: a name, or any `uint64` value. Numeric scopes above 2^53 must be passed as a `UInt64`, since a `number` cannot hold them. */
export type TableScopeType = NameType | UInt64Type

export function pascalCase(value: string): string {
    return value
        .split(/_| /)
        .map((w) => {
            return w[0].toUpperCase() + w.slice(1).toLowerCase()
        })
        .join('')
}

export function capitalize(string) {
    if (typeof string !== 'string' || string.length === 0) {
        return ''
    }

    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function singularize(word: string): string {
    if (word.endsWith('ies')) {
        return word.slice(0, -3) + 'y'
    } else if (word.endsWith('ches') || word.endsWith('ses')) {
        return word.slice(0, -2)
    } else if (word.endsWith('s') && word.length > 1 && word[word.length - 2] !== 's') {
        return word.slice(0, -1)
    } else {
        return word
    }
}

export function indexPositionInWords(index: number): string {
    return [
        'primary',
        'secondary',
        'tertiary',
        'fourth',
        'fifth',
        'sixth',
        'seventh',
        'eighth',
        'ninth',
        'tenth',
    ][index]
}

export function wrapIndexValue(value): API.v1.TableIndexType | undefined {
    if (value === undefined || value === null) {
        return
    }

    if (
        isInstanceOf(value, UInt128) ||
        isInstanceOf(value, UInt64) ||
        isInstanceOf(value, Float64) ||
        isInstanceOf(value, Checksum256) ||
        isInstanceOf(value, Checksum160)
    ) {
        return value
    }

    if (typeof value === 'number') {
        return UInt64.from(value)
    }

    return Name.from(value)
}

/** Whether a scope is absent, meaning a query should fall back to its default. A `0` scope is present. */
export function isAbsentScope(value?: TableScopeType | null): value is undefined | null | '' {
    return value === undefined || value === null || value === ''
}

/** Resolve a {@link TableScopeType} to the value sent as the `scope` of a table query. */
export function wrapScopeValue(value: TableScopeType): Name | UInt64 | string {
    if (value === undefined || value === null) {
        throw new Error('Scope is required')
    }

    if (isInstanceOf(value, Name)) {
        return value
    }

    // Strings reach the chain untouched, which reads an all-digit scope as a number and the rest as a name
    if (typeof value === 'string') {
        return value
    }

    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
        throw new Error(
            `Scope ${value} is not an integer a number can hold, use UInt64.from() to pass it instead`
        )
    }

    return UInt64.from(value)
}

export function abiToBlob(abi: ABI): Blob {
    const serializedABI = Serializer.encode({object: abi, type: ABI})
    return new Blob(serializedABI.array)
}

export function blobStringToAbi(blobString: string): ABI {
    const blob = Blob.from(blobString)
    return ABI.from(blob)
}

export function formatExceptionMessage(except: API.v1.SendTransactionResponseException): string {
    const top = except.stack?.[0]
    if (top?.format) {
        const data = top.data ?? {}
        const substituted = top.format.replace(/\$\{(\w+)\}/g, (_, key) =>
            key in data ? String(data[key]) : `\${${key}}`
        )
        if (substituted) return substituted
    }
    if (typeof top?.data?.s === 'string') {
        return top.data.s
    }
    return except.message
}
