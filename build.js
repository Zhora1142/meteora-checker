// build.js
const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['ts/script.ts'],
    bundle: true,
    outfile: 'static/js/script.js',
    minify: true,
    sourcemap: true,
    target: ['es6'],
    platform: 'browser'
}).catch(() => process.exit(1));
