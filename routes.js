'use strict';

const db = require('./models/index').db;
const CategoriesController = require('./controllers/categories.controller');

const categoriesController = new CategoriesController(db.Category);

const usersController = require('./controllers/users.controller');
const workspacesController = require('./controllers/workspaces.controller');
const entriesController = require('./controllers/entries.controller');
const snapshotsController = require('./controllers/snapshots.controller');

// console.log('ROUTER Categories controller', CategoriesController);
// console.log('ROUTER DB User', db.User);
// console.log('ROUTER DB Entry', db.Entry);


const router = require('koa-router')();

const authorize = async (ctx, next) => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }
  await next();
};

const routes = function (app) {
  // User
  router.get('/log-in', usersController.logIn);
  router.post('/sign-up', usersController.create);
  router.delete('/remove', authorize, usersController.removeUser);

  // Categories
  router.get('/categories', authorize, categoriesController.getAllCategory);
  router.get('/categories/:id', authorize, categoriesController.getCategory);
  router.post('/categories', authorize, categoriesController.addCategory);

  // Workspaces
  router.get('/dashboard', authorize, workspacesController.dashboard);
  router.post('/dashboard', authorize, workspacesController.addWorkspace);
  router.delete('/dashboard/:id', authorize, workspacesController.deleteWorkspace);

  // Entries
  router.get('/dashboard/:id/', authorize, entriesController.listEntries);
  router.post('/dashboard/:id/', authorize, entriesController.addEntry);
  router.delete('/dashboard/:id/:entryId', authorize, entriesController.deleteEntry);

  // Snapshots
  router.post('/dashboard/:id/:entryId', authorize, snapshotsController.addSnapshot);
  router.delete('/dashboard/:id/:entryId/:snapId', authorize, snapshotsController.deleteSnapshot);

  router.options('/', options);
  router.trace('/', trace);
  router.head('/', head);

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
};


const head = async () => {
  return;
};

const options = async () => {
  this.body = 'Allow: HEAD,GET,PUT,DELETE,OPTIONS';
};

const trace = async () => {
  this.body = 'Smart! But you can\'t trace.';
};

module.exports = routes;
