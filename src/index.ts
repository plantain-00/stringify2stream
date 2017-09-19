/**
 * @public
 */
export default function stringify(value: any, write: (data: string) => void, replacer?: ((key: string, value: any) => any) | (number | string)[] | null, space?: string | number) {
    if (isInvalidValue(value)) {
        write("undefined");
        return;
    }
    if (Array.isArray(value)) {
        write("[");
        for (let i = 0; i < value.length; i++) {
            if (isInvalidValue(value[i])) {
                write("null");
            } else {
                stringify(value[i], write);
            }
            if (i !== value.length - 1) {
                write(",");
            }
        }
        write("]");
    } else if (typeof value === "string" || value instanceof String) {
        write(`"${value}"`);
    } else if (typeof value === "boolean" || value instanceof Boolean) {
        write(value.toString());
    } else if (typeof value === "number" || value instanceof Number) {
        write(value.toString());
    } else if (value === null) {
        write("null");
    } else if (value instanceof Date) {
        write(`"${value.toISOString()}"`);
    } else if (typeof value === "object") {
        write("{");
        let canEmitComma = false;
        // tslint:disable-next-line:forin
        for (const key in value) {
            const child = value[key];
            if (canEmitComma) {
                write(",");
            }
            if (!isInvalidValue(child)) {
                write(`"${key}":`);
                canEmitComma = true;
                stringify(child, write);
            }
        }
        write("}");
    }
}

function isInvalidValue(value: any) {
    return value === undefined
        || typeof value === "function"
        || typeof value === "symbol";
}
