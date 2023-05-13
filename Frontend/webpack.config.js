const path = require('path');
module.exports = {
  entry: "./src/index.js", // Change this to your entry point
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
            {
                loader: 'babel-loader',
                options: {
                presets: ['@babel/preset-env'],
                sourceMap: false, // disable source map processing
                },
            },
            ],
        },
        {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'source-map-loader',
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                if (/web3\.min\.js/.test(url)) { // exclude web3.min.js from source map processing
                  return false;
                }
                return true;
              },
              sourceMap: true, // enable source map processing
            },
          },
        ],
        enforce: 'pre',
        }
    ],
  },
};
