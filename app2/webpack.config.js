const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;
module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist")
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: 3002,
  },
  experiments: {
    outputModule: true
  },
  externalsType: "module",
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  target: "es2020",
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      filename: "remoteEntry.js",
      library: {
        type: "module"
      },
      remotes: {
        app1: "http://127.0.0.1:3001/remoteEntry.js",
      },
      exposes: {
        "./Button": "./src/Button",
      },
      shared: [
        {
          // ...deps,
          react: {
            // eager: true,
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            // eager: true,
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.ejs",
      inject: false
    }),
  ],
};
