module.exports = [
    {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        use: [
            {
                loader: "url-loader",
                options: {
                    name: "[name].[hash:5].[ext]",
                    limit: 1024, // size <= 1kib
                    outputPath: "img"
                }
            }
        ]
    }
];