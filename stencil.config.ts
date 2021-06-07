import {Config} from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import {postcss} from '@stencil/postcss';
import autoprefixer from 'autoprefixer';

const purgecss = require("@fullhuman/postcss-purgecss")({
    content: ["./src/**/*.tsx", "./src/**/*.css", "./src/index.html"],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

//process.env.NODE_ENV ="development";
process.env.NODE_ENV = "production";

export const config: Config = {
    namespace: 'stencil-map',
    rollupPlugins: {
        after: [
            nodePolyfills(),
        ]
    },
    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader'
        },
        {
            type: 'docs-readme'
        },
        {
            type: 'www',
            serviceWorker: null // disable service workers
        }
    ],
    "plugins" : [
        postcss({
            plugins: [
                require("postcss-import"),
                require("tailwindcss")("./tailwind.config.js"),
                autoprefixer(),
                ...(process.env.NODE_ENV === "production"
                    ? [purgecss, require("cssnano")]
                    : [])
            ]
        })
    ],
    devServer: {
        reloadStrategy: 'hmr'
    }
};
