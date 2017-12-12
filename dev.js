const cp = require('child_process');
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');
const butternut = require('rollup-plugin-butternut');
const nodeResolve = require('rollup-plugin-node-resolve');

cp.spawn('stylus', '-w -u nib css/index.styl -o docs/css/deck.css'.split(' '), { stdio: 'inherit' });

const watcher = rollup.watch({
  input: 'js/index.js',
  plugins: [
    nodeResolve(),
    buble(),
    butternut()
  ],
  output: [{
    format: 'es',
    file: 'docs/deck.es.js'
  }, {
    format: 'umd',
    name: 'deck',
    file: 'docs/deck.js'
  }, {
    format: 'umd',
    name: 'deck',
    file: 'docs/deck.dev.js',
    sourcemap: true
  }, {
    format: 'es',
    file: 'docs/deck.es.dev.js',
    sourcemap: true
  }]
});

watcher.on('event', console.log);
