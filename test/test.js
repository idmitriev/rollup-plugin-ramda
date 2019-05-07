var assert = require('assert');
var rollup = require('rollup');
var ramda = require('..');

process.chdir(__dirname);

describe('rollup-plugin-ramda', function() {
  it('inserts a single import statement', async function() {
    const bundle = await rollup.rollup({
      input: 'samples/single.js',
      plugins: [ramda({})],
      external: ['ramda']
    });

    const { output } = await bundle.generate({ format: 'esm' });
    const asset = output[0];
    assert.ok(asset.code.indexOf("import map from 'ramda/es/map'") !== -1, asset.code);
  });

  it('inserts multiple import statement', async function() {
    const bundle = await rollup.rollup({
      input: 'samples/multiple.js',
      plugins: [ramda({})],
      external: ['ramda']
    });
    const { output } = await bundle.generate({ format: 'esm' });
    const asset = output[0];

    assert.ok(asset.code.indexOf("import map from 'ramda/es/map'") !== -1, asset.code);
    assert.ok(asset.code.indexOf("import reduce from 'ramda/es/reduce'") !== -1, asset.code);
  });
});
