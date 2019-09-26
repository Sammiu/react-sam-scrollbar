'use strict';

const path = require('path');

exports.resolve = function (dir) {
    return path.join(__dirname, './../', dir);
};

exports.resolveApp = function (relativePath) {
    return path.resolve(relativePath);
};

exports.resolveAssetsRootDir = function (dir) {
    return path.join(dir);
};