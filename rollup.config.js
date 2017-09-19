import uglify from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'dist/browser/index.js',
  dest: 'dist/stringify2stream.min.js',
  format: 'umd',
  moduleName: 'Stringify2stream',
  plugins: [resolve(), uglify()]
}
