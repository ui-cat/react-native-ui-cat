const path = require('path');
const environment = require('./env');

const evaModules = {
  '@ui-cat/eva-design-eva': path.resolve(environment.EVA_PATH, 'eva'),
  '@ui-cat/eva-design-material': path.resolve(environment.EVA_PATH, 'material'),
  '@ui-cat/eva-design-processor': path.resolve(environment.EVA_PATH, 'processor'),
};

const frameworkModules = {
  '@ui-cat/components': path.resolve(__dirname, '../components'),
  '@ui-cat/date-fns': path.resolve(__dirname, '../date-fns'),
  '@ui-cat/eva-icons': path.resolve(__dirname, '../eva-icons'),
  '@ui-cat/moment': path.resolve(__dirname, '../moment'),
};

const moduleResolverConfig = {
  root: path.resolve('./'),
  alias: {
    ...evaModules,
    ...frameworkModules,
  },
};

const presets = [
  'babel-preset-expo',
];

const plugins = [
  ['module-resolver', moduleResolverConfig],
  ["@babel/plugin-proposal-decorators", { 'legacy': true }],
  ["react-native-web", { commonjs: true }]
];

module.exports = function (api) {
  api.cache(true);
  return { presets, plugins };
};
