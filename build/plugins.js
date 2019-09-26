'use strict';

const {resolveApp} = require('./utils');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    new htmlWebpackPlugin({
        template: 'build/tpl/index.html',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        }
    })
];
