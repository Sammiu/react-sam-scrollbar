'use strict';

const jsRules = require('./rules/jsRules');
const imgRules = require('./rules/imgRules');
const styleRules = require('./rules/styleRules');
const webpackConfig = require('./webpack.base.config');

styleRules.forEach(item => {
    item.use = ['style-loader', ...item.use]
});

webpackConfig.module = {
    rules: [...jsRules, ...styleRules, ...imgRules]
};

module.exports = webpackConfig;