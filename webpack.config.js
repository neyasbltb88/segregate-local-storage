require('dotenv').config();

const devConfig = require('./webpack.dev.config');
const prodConfig = require('./webpack.prod.config');

const NODE_ENV = process.env.NODE_ENV || 'development';
const DEV = NODE_ENV === 'development';

let config = DEV ? devConfig : prodConfig;

module.exports = config;
