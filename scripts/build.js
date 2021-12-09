require('esbuild')
    .build({
        entryPoints: ['src/main.ts'],
        bundle: true,
        minify: true,
        outfile: 'build/bw-to-1p.js',
        platform: 'node',
        target: 'node14',
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
