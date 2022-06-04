import { merge } from 'webpack-merge';
import webpack from 'webpack';
import commonConfigurationGenerator, { WebpackEnv } from './webpack.config';

const configurationGenerator = (env: WebpackEnv): webpack.Configuration => {
  const configuration = merge(commonConfigurationGenerator(env), {
    mode: 'production'
  });

  return configuration;
};

export default configurationGenerator;
