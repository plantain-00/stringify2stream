import * as stream from 'stream'
import stringify from '../dist/nodejs'

function test (value: any, replacer?: any, space?: string | number) {
  let result: string | undefined = ''
  const writeStream = new stream.Writable({
    write (chunk, encoding, callback) {
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
  expect(result).toEqual(JSON.stringify(value, replacer, space))
}

// tslint:disable:no-construct

it('', () => {
  test(undefined)
  test({})
  test(true)
  test(new Boolean(true))
  test('foo')
  test(1)
  test(new Number(1))
  test(() => 1)
  test(new String('foo'))
  test(Symbol('foo'))
  test([1, 'false', false])
  test({ x: 5 })
  test(new Date(2006, 0, 2, 15, 4, 5))
  test({ x: 5, y: 6 })
  test([new Number(3), new String('false'), new Boolean(false)])
  test({ x: [10, undefined, () => { /**/ }, Symbol('')] })
  test({ x: undefined, y: Object, z: Symbol('') })
  test({ [Symbol('foo')]: 'foo' })
  test(Object.create(null, { x: { value: 'x', enumerable: false }, y: { value: 'y', enumerable: true } }))
  test({ a: 2 }, null, ' ')
  test({ a: 2 }, null, '  ')
  test({ a: 2 }, null, 3)
  test({ a: 2, b: 'abc' }, null, ' ')
  test([1, 2, 3], null, ' ')
  test([])
  test([], null, 1)
  test({})
  test({}, null, 1)
  test({ a: [1, 2, 3] }, null, ' ')
  test([{ a: 1, b: [2] }], null, ' ')
  test({ uno: 1, dos: 2 }, null, '\t')
  test({
    foo: 'foo',
    bar () {
      return 'bar'
    }
  })
  const obj = {
    foo: 'foo',
    toJSON () {
      return 'bar'
    }
  }
  test(obj)
  test({ x: obj })
  const obj2 = {
    foo: 'foo',
    toJSON (key: string) {
      if (key === '') {
        return 'bar only'
      } else {
        return 'bar in ' + key
      }
    }
  }
  test(obj2)
  test({ x: obj2 })
  test([obj2, obj2])
  test({ foo: 'a"b' })
  test({
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
  test({ a: 2 }, null, 11)
  test({ a: 2 }, null, 0)
  test({ a: 2 }, null, 2.9)
  test({ a: 2 }, null, NaN)
  test({ a: 2 }, null, '1234567890abc')
  const replacer = (key: string, value: any) => {
    if (typeof value === 'string') {
      return undefined
    }
    return value
  }
  test({ foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7 }, replacer)
  test(['foo', 123], replacer)
  test({ foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7 }, ['week', 'month'])
})
