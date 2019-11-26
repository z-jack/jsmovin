const path = require('path');

module.exports = {
    // Change to your "entry-point".
    entry: './bin/jsmovin',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jsmovin.min.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    }
};