//Allow us to pass any type and check if this type is defined(if undefined or null throw error)
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
    if (val === undefined || val === null) {
        throw Error(`Expected 'val' to be defined, but received ${val}`);
    }
}

export default assertIsDefined;