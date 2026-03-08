import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  entry: {
    index: "./src/index.js",
    home: "./src/pages/home/home.js",
    login: "./src/pages/about/login.js",
    sign: "./src/pages/sign/sign.js",
    "music-library": "./src/pages/home/music-library.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/pages/home/home.html",
      filename: "home.html",
      chunks: ["index", "home", "music-library"], // ← "shared" байхгүй тул "index" болгов
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/about/login.html",
      filename: "login.html",
      chunks: ["index", "login"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/pages/sign/sign.html",
      filename: "sign.html",
      chunks: ["index", "sign"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "img"),
          to: "img",
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 4000,
    open: ["login.html"],
  },
};
