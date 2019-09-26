'use strict';

const plugins = require('./plugins');
const {resolve} = require('./utils');

module.exports = {
    entry: {
        app: ['@babel/polyfill', resolve('examples/index')]
    },
    output: {
        path: resolve('dist'),
        filename: '[name].[hash:8].js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': resolve('src'),
            'components': resolve('src/components'),
        },
    },
    plugins: [...plugins],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
