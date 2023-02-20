import { resolve } from 'path';

export const entry = "./src/index.js";
export const mode = "development";
export const output = {
  path: resolve(__dirname, "dist"),
  filename: "main.js"
};
export const devtool = "sourcemap";
export const module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }
  ]
};
