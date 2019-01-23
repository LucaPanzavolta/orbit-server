'use strict';

// Init server
const koa = require('koa');
const app = module.exports = new koa();
const routes = require('./routes.js');

require('./db');

// Dependencies
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('kcors');
const logger = require('koa-logger');
const cache = require('koa-redis-cache');

// Logger
app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (httpError) {
    ctx.body = httpError.message;
    ctx.status = httpError.status;
  }
});

routes(app);

// Compress
app.use(compress());

// Run server
if (!module.parent) {
  const ip =  'localhost';
  const port = 3000;
  app.listen(port);
  console.log(`Orbits server running at http://${ip}:${port}`);
}

module.exports = app; // for testing