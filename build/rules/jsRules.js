'use strict';

module.exports = [
    {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
        }
    }
];