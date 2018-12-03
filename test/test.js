var assert = require( 'assert' );
var rollup = require( 'rollup' );
var ramda = require( '..' );

process.chdir( __dirname );

describe( 'rollup-plugin-ramda', function () {
    it('inserts a single import statement', function () {
        return rollup.rollup({
            entry: 'samples/single.js',
            plugins: [ ramda({}) ],
            external: ['ramda'],
        }).then(function (bundle) {
            var generated = bundle.generate();
            var code = generated.code;
            assert.ok(code.indexOf("import map from 'ramda/es/map'") !== -1, generated.code);
        });
    });

    it('inserts multiple import statement', function () {
        return rollup.rollup({
            entry: 'samples/multiple.js',
            plugins: [ ramda({}) ],
            external: ['ramda'],
        }).then(function (bundle) {
            var generated = bundle.generate();
            var code = generated.code;

            assert.ok(code.indexOf("import map from 'ramda/es/map'") !== -1, generated.code);
            assert.ok(code.indexOf("import reduce from 'ramda/es/reduce'") !== -1, generated.code);
        });
    });
})