const {resolve} = require('../utils');

module.exports = [
    {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
    },
    {
        test: /\.scss$/,
        include: resolve('src'),
        use: [
            {
                loader: 'cache-loader',
                options: {
                    cacheDirectory: resolve('.cache-loader')
                }
            },
            {
                loader: require.resolve('css-loader'),
                options: {
                    importLoaders: 1,
                    modules: true
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    includePaths: [resolve('src/styles')]
                }
            }
        ]
    },
    {
        test: /\.less$/,
        use: [
            'css-loader',
            {
                loader: 'less-loader',
                options: {
                    // javascriptEnabled: true,
                    // modifyVars: theme
                }
            }
        ]
    }
];
