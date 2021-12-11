import * as esbuild from 'esbuild';

esbuild
    .build({
        entryPoints: ['bin/main.ts'],
        bundle: true,
        minify: true,
        outfile: 'build/main.js',
        platform: 'node',
        target: 'node14',
        sourcemap: true,
    })
    .catch((error: any) => {
        console.error(error);
        process.exit(1);
    });
