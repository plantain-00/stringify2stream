# stringify2stream

[![Dependency Status](https://david-dm.org/plantain-00/stringify2stream.svg)](https://david-dm.org/plantain-00/stringify2stream)
[![devDependency Status](https://david-dm.org/plantain-00/stringify2stream/dev-status.svg)](https://david-dm.org/plantain-00/stringify2stream#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/stringify2stream.svg?branch=master)](https://travis-ci.org/plantain-00/stringify2stream)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/stringify2stream?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/stringify2stream/branch/master)
[![npm version](https://badge.fury.io/js/stringify2stream.svg)](https://badge.fury.io/js/stringify2stream)
[![Downloads](https://img.shields.io/npm/dm/stringify2stream.svg)](https://www.npmjs.com/package/stringify2stream)
[![gzip size](https://img.badgesize.io/https://unpkg.com/stringify2stream?compression=gzip)](https://unpkg.com/stringify2stream)

A js library to stringify json to stream to avoid out-of-memory of JSON.stringify.

## install

`yarn add stringify2stream`

## usage

```ts
import stringify from "stringify2stream";
// <script src="./node_modules/stringify2stream/stringify2stream.min.js"></script>

const writeStream = getWritableStreamSomehow();
stringify({ foo: 123 }, data => writeStream.write(data));
```

## types

```ts
export default function stringify(value: any, write: (data: string | undefined) => void, replacer?: ((key: string, value: any) => any) | (number | string)[] | null, space?: string | number): void
```
