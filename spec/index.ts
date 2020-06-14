import test from 'ava'
import * as stream from 'stream'
import stringify from '../src'

test('stringify', (t) => {
  function testStringify(value: any, replacer?: any, space?: string | number) {
    let result: string | undefined = ''
    const writeStream = new stream.Writable({
      write(chunk, encoding, callback) {
        result += chunk.toString()
        callback()
      }
    })
    stringify(value, data => {
      if (data === undefined) {
        result = undefined
      } else {
        writeStream.write(data)
      }
    }, replacer, space)
    writeStream.end()
    t.is(result, JSON.stringify(value, replacer, space))
  }

  testStringify(undefined)
  testStringify({})
  testStringify(true)
  testStringify(new Boolean(true))
  testStringify('foo')
  testStringify(1)
  testStringify(new Number(1))
  testStringify(() => 1)
  testStringify(new String('foo'))
  testStringify(Symbol('foo'))
  testStringify([1, 'false', false])
  testStringify({ x: 5 })
  testStringify(new Date(2006, 0, 2, 15, 4, 5))
  testStringify({ x: 5, y: 6 })
  testStringify([new Number(3), new String('false'), new Boolean(false)])
  testStringify({ x: [10, undefined, () => { /**/ }, Symbol('')] })
  testStringify({ x: undefined, y: Object, z: Symbol('') })
  testStringify({ [Symbol('foo')]: 'foo' })
  testStringify(Object.create(null, { x: { value: 'x', enumerable: false }, y: { value: 'y', enumerable: true } }))
  testStringify({ a: 2 }, null, ' ')
  testStringify({ a: 2 }, null, '  ')
  testStringify({ a: 2 }, null, 3)
  testStringify({ a: 2, b: 'abc' }, null, ' ')
  testStringify([1, 2, 3], null, ' ')
  testStringify([])
  testStringify([], null, 1)
  testStringify({})
  testStringify({}, null, 1)
  testStringify({ a: [1, 2, 3] }, null, ' ')
  testStringify([{ a: 1, b: [2] }], null, ' ')
  testStringify({ uno: 1, dos: 2 }, null, '\t')
  testStringify({
    foo: 'foo',
    bar() {
      return 'bar'
    }
  })
  const obj = {
    foo: 'foo',
    toJSON() {
      return 'bar'
    }
  }
  testStringify(obj)
  testStringify({ x: obj })
  const obj2 = {
    foo: 'foo',
    toJSON(key: string) {
      if (key === '') {
        return 'bar only'
      } else {
        return 'bar in ' + key
      }
    }
  }
  testStringify(obj2)
  testStringify({ x: obj2 })
  testStringify([obj2, obj2])
  testStringify({ foo: 'a"b' })
  testStringify({
    name: 'stringify2stream',
    version: '1.0.0',
    description: 'A js library to stringify json to stream to avoid out-of-memory of JSON.stringify.',
    main: 'index.js',
    scripts: {
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix',
      release: 'clean-scripts release'
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/plantain-00/stringify2stream.git'
    },
    author: 'York Yao',
    license: 'MIT',
    bugs: {
      url: 'https://github.com/plantain-00/stringify2stream/issues'
    },
    homepage: 'https://github.com/plantain-00/stringify2stream#readme',
    devDependencies: {
      '@types/jasmine': '2.6.0',
      'clean-release': '1.3.5',
      'clean-scripts': '1.2.6',
      'jasmine': '2.8.0',
      'no-unused-export': '1.2.7',
      'rimraf': '2.6.2',
      'rollup': '0.50.0',
      'rollup-plugin-node-resolve': '3.0.0',
      'rollup-plugin-uglify': '2.0.1',
      'standard': '10.0.3',
      'tslint': '5.7.0',
      'typescript': '2.5.2'
    }
  }, null, '  ')
  testStringify({ a: 2 }, null, 11)
  testStringify({ a: 2 }, null, 0)
  testStringify({ a: 2 }, null, 2.9)
  testStringify({ a: 2 }, null, NaN)
  testStringify({ a: 2 }, null, '1234567890abc')
  const replacer = (key: string, value: any) => {
    if (typeof value === 'string') {
      return undefined
    }
    return value
  }
  testStringify({ foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7 }, replacer)
  testStringify(['foo', 123], replacer)
  testStringify({ foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7 }, ['week', 'month'])
})
