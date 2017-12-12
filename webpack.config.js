const webpack = require('webpack');
const path = require('path');
console.log(path.resolve(__dirname, "public", "src"));
let config = {
    entry: path.resolve('src/'),
    watch: true,
    resolve: {
        modules: [
            path.resolve(__dirname, "src"),
            "node_modules"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                },
                exclude: /templates/
            }
        ]
    },
    output: {
        path: path.resolve("public/js"),
        publicPath: "/js/",
        filename: 'bundle.js'
    },
    devServer: {
        open: true,
        port: 8080,
        //host: "0.0.0.0",
        contentBase: __dirname + '/public',
    }
};

module.exports = config;