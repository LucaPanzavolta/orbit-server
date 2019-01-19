const request = require("supertest");
const EntriesController = require("../controllers/entries.controller");

////////////////////////  Database   ///////////////////////
const UserModelDB = require('../models/user.model');
const EntryModelDB = require('../models/entry.model');
///////////////////////////////////////////////////////////

///////////////////////  Mock data   ///////////////////////
const mocks = require('./mocks');
// mocks.User   mocks.Entry   mock.user_id    mock.ctx
///////////////////////////////////////////////////////////

const entriesController = new EntriesController(mocks.User, mocks.Entry);

describe ("Test `entries.controller.js` ", () => {
  describe ("GET `/dashboard/:id/` listEntriesByWorkspace() - ", () => {

    test ("Returns status 200 if the Workspace is found.", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      
      await entriesController.listEntriesByWorkspace(ctx, mocks.next);
      expect(ctx.status).toEqual(200);
      done();
    });

    test ("Returns status 404 if the Workspace is not found.", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.false.workspace_id);
      await entriesController.listEntriesByWorkspace(ctx, mocks.next);
      expect(ctx.status).toEqual(404);
      done();
    });

  });
});