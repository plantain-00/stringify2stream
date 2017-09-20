/**
 * @public
 */
export default function stringify(value: any, write: (data: string | undefined) => void, replacer?: ((key: string, value: any) => any) | (number | string)[] | null, space?: string | number) {
    if (isInvalidValue(value)) {
        write(undefined);
        return;
    }
    let indent: string | undefined;
    if (typeof space === "number"
        && !isNaN(space)
        && space >= 1) {
        indent = "";
        const spaceCount = Math.min(Math.floor(space), 10);
        for (let i = 0; i < spaceCount; i++) {
            indent += " ";
        }
    } else if (typeof space === "string") {
        indent = space.substring(0, 10);
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
                write(`,`);
            }
        }
        if (baseIndent !== undefined) {
            write(`\n${indent}]`);
        } else {
            write(`]`);
        }
    } else if (typeof value === "string" || value instanceof String) {
        write(escapeQuote(value.toString()));
    } else if (typeof value === "boolean"
        || value instanceof Boolean
        || typeof value === "number"
        || value instanceof Number) {
        write(`${value.toString()}`);
    } else if (value === null) {
        write(`null`);
    } else if (value instanceof Date) {
        write(escapeQuote(value.toISOString()));
    } else if (typeof value === "object") {
        if (typeof value.toJSON === "function") {
            if (parent.type === ParentType.root) {
                write(escapeQuote(value.toJSON("")));
            } else if (parent.type === ParentType.array) {
                write(escapeQuote(value.toJSON(parent.index.toString())));
            } else {
                write(escapeQuote(value.toJSON(parent.propertyName)));
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
                    write(`,`);
                }
                if (baseIndent !== undefined) {
                    write(`\n${currentIndent}${escapeQuote(key)}: `);
                } else {
                    write(`${escapeQuote(key)}:`);
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

const quoteEscapeRegExp = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
const meta: { [key: string]: string | undefined } = {
    "\b": "\\b",
    "\t": "\\t",
    "\n": "\\n",
    "\f": "\\f",
    "\r": "\\r",
    "\"": "\\\"",
    "\\": "\\\\",
};

function escapeQuote(str: string) {
    quoteEscapeRegExp.lastIndex = 0;
    return quoteEscapeRegExp.test(str)
        ? "\"" + str.replace(quoteEscapeRegExp, a => {
            const c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\""
        : "\"" + str + "\"";
}
