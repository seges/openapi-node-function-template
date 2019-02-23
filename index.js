require('dotenv').config();

const service = require('./service');
const handler = require('./function/handler');

service(handler);