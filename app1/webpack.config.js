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
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  output: {
    publicPath: "auto",
  },
  experiments: {
    outputModule: true
  },
  externalsType: "module",
  target: "es2020",
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
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      library: {
        type: "module"
      },
      remotes: {
        app2: "http://127.0.0.1:3002/remoteEntry.js",
      },
      exposes: {
        "./Button": "./src/Button",
      },
      
      // sharing code based on the installed version, to allow for multiple vendors with different versions
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
