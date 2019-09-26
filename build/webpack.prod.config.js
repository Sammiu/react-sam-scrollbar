'use strict';

const webpack = require('webpack');
const optimization = require('./optimization');
const jsRules = require('./rules/jsRules');
const styleRules = require('./rules/styleRules');
const imgRules = require('./rules/imgRules');
const {resolveAssetsRootDir} = require('./utils');
const webpackConfig = require('./webpack.base.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

styleRules.forEach(item => {
    item.use = [MiniCssExtractPlugin.loader, ...item.use]
});

webpackConfig.module = {
    rules: [...jsRules, ...styleRules, ...imgRules]
};

webpackConfig.plugins = [...webpackConfig.plugins,
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new MiniCssExtractPlugin({
        filename: resolveAssetsRootDir('css/[name].css')
    })
];

webpackConfig.optimization = optimization;

module.exports = webpackConfig;