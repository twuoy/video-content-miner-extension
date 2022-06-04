import { resolve } from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export type WebpackEnv = {
  API_URL?: string;
};

const commonConfigurationGenerator = (env: WebpackEnv): webpack.Configuration => {
  return {
    entry: {
      popup: './src/index-popup.tsx',
      background: './src/background.ts',
      content: './src/content.ts',
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(env.API_URL || 'http://localhost:50000/api')
      }),
      new HtmlWebpackPlugin({
        template: './src/popup.html',
        filename: 'popup.html',
        chunks: ['popup']
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "public", to: "." },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    output: {
      // any file defined in the entry will be copy with the exact name
      filename: '[name].js',
      path: resolve(__dirname, 'dist'),
    },
  }
};

export default commonConfigurationGenerator;
