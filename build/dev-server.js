'uses strict';

const opn = require('opn');
const config = require('./webpack.dev.config');

config.devServer = {
    port: 9111,
    inline: true,
    noInfo: true,
    stats: {colors: true},
    historyApiFallback: true,
    proxy: {
    },
    overlay: {
        warnings: true,
        errors: true
    },
    after: function () {
        const uri = 'http://localhost:' + this.port;
        opn(uri)
    }
};

module.exports = config;
