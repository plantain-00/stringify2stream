import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/browser/index.js',
  name: 'Stringify2stream',
  plugins: [resolve({ browser: true }), uglify()],
  output: {
    file: 'dist/stringify2stream.min.js',
    format: 'umd'
  }
}
