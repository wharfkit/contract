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
