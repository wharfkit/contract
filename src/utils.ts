import {
    ABI,
    API,
    Blob,
    Checksum160,
    Checksum256,
    Float64,
    isInstanceOf,
    Name,
    Serializer,
    UInt128,
    UInt64,
} from '@wharfkit/antelope'

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

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
    if (!value) {
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

export function abiToBlob(abi: ABI): Blob {
    const serializedABI = Serializer.encode({object: abi, type: ABI})
    return new Blob(serializedABI.array)
}

export function blobStringToAbi(blobString: string): ABI {
    const blob = Blob.from(blobString)
    return ABI.from(blob)
}
