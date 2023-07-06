import {
    ABISerializable,
    ABISerializableConstructor,
    ABISerializableObject,
    API,
    Name,
} from '@wharfkit/session'

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
    } else if (word.endsWith('ches') || word.endsWith('sses')) {
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

export function wrapIndexValue(
    value,
    indexType?: API.v1.TableIndexType
): API.v1.TableIndexType | undefined {
    if (!value) {
        return
    }

    if (indexType) {
        return indexType.from(value)
    }

    return Name.from(value)
}
