/**
 * @public
 */
export default function stringify(value: any, write: (data: string) => void, replacer?: ((key: string, value: any) => any) | (number | string)[] | null, space?: string | number) {
    if (isInvalidValue(value)) {
        write("undefined");
        return;
    }
    let indent: string | undefined;
    if (typeof space === "number") {
        indent = "";
        for (let i = 0; i < space; i++) {
            indent += " ";
        }
    } else if (typeof space === "string") {
        indent = space;
    }

    stringifyInternally(value, write, indent, "", { type: ParentType.root });
}

const enum ParentType {
    root,
    array,
    object,
}

type Parent =
    {
        type: ParentType.root;
    }
    | {
        type: ParentType.array;
        index: number;
    } | {
        type: ParentType.object;
        propertyName: string;
    };

function stringifyInternally(value: any, write: (data: string) => void, baseIndent: string | undefined, indent: string, parent: Parent) {
    const currentIndent = baseIndent === undefined ? indent : indent + baseIndent;
    if (Array.isArray(value)) {
        write(`[`);
        for (let i = 0; i < value.length; i++) {
            if (baseIndent !== undefined) {
                write(`\n${currentIndent}`);
            }
            if (isInvalidValue(value[i])) {
                write(`null`);
            } else {
                stringifyInternally(value[i], write, baseIndent, currentIndent, {
                    type: ParentType.array,
                    index: i,
                });
            }
            if (i !== value.length - 1) {
                write(",");
            }
        }
        if (baseIndent !== undefined) {
            write(`\n${indent}]`);
        } else {
            write(`]`);
        }
    } else if (typeof value === "string" || value instanceof String) {
        write(`"${value}"`);
    } else if (typeof value === "boolean"
        || value instanceof Boolean
        || typeof value === "number"
        || value instanceof Number) {
        write(`${value.toString()}`);
    } else if (value === null) {
        write(`null`);
    } else if (value instanceof Date) {
        write(`"${value.toISOString()}"`);
    } else if (typeof value === "object") {
        if (typeof value.toJSON === "function") {
            if (parent.type === ParentType.root) {
                write(`"${value.toJSON("")}"`);
            } else if (parent.type === ParentType.array) {
                write(`"${value.toJSON(parent.index.toString())}"`);
            } else {
                write(`"${value.toJSON(parent.propertyName)}"`);
            }
            return;
        }
        write(`{`);
        let canEmitComma = false;
        // tslint:disable-next-line:forin
        for (const key in value) {
            const child = value[key];
            if (!isInvalidValue(child)) {
                if (canEmitComma) {
                    write(",");
                }
                if (baseIndent !== undefined) {
                    write(`\n${currentIndent}"${key}": `);
                } else {
                    write(`"${key}":`);
                }
                canEmitComma = true;
                stringifyInternally(child, write, baseIndent, currentIndent, {
                    type: ParentType.object,
                    propertyName: key,
                });
            }
        }
        if (baseIndent !== undefined) {
            write(`\n${indent}}`);
        } else {
            write(`}`);
        }
    }
}

function isInvalidValue(value: any) {
    return value === undefined
        || typeof value === "function"
        || typeof value === "symbol";
}
