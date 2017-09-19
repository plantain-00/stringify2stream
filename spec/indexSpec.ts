import * as stream from "stream";
import stringify from "../dist/nodejs";

function test(value: any, replacer?: any, space?: string | number) {
    let result = "";
    const writeStream = new stream.Writable({
        write(chunk, encoding, callback) {
            result += chunk.toString();
            callback();
        },
    });
    stringify(value, data => writeStream.write(data));
    writeStream.end();
    expect(result).toEqual(JSON.stringify(value, replacer, space));
}

// tslint:disable:no-construct
// tslint:disable:only-arrow-functions

it("", () => {
    test({});
    test(true);
    test("foo");
    test([1, "false", false]);
    test({ x: 5 });
    test(new Date(2006, 0, 2, 15, 4, 5));
    test({ x: 5, y: 6 });
    test([new Number(3), new String("false"), new Boolean(false)]);
    test({ x: [10, undefined, function() { /**/ }, Symbol("")] });
    test({ x: undefined, y: Object, z: Symbol("") });
    test({ [Symbol("foo")]: "foo" });
    test(Object.create(null, { x: { value: "x", enumerable: false }, y: { value: "y", enumerable: true } }));
});
