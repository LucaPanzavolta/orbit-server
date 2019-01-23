const EntriesController = require("../controllers/entries.controller");

////////////////////////  Database   ///////////////////////
const UserModelDB = require('../models/user.model');
const EntryModelDB = require('../models/entry.model');
///////////////////////////////////////////////////////////

///////////////////////  Mock data   ///////////////////////
const mocks = require('./mocks');
// mocks.User   mocks.Entry   mock.user_id    mock.ctx
///////////////////////////////////////////////////////////

const UserMock = {};
const EntryMock = {};
const entriesController = new EntriesController(UserMock, EntryMock);

describe ("Test `entries.controller.js` ", () => {

  describe ("GET `/dashboard/:id/` --> .listEntriesByWorkspace()", () => {

    test ("Returns status 200 if the Workspace is found.", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      
      UserMock.findOne = () => ({
        workspaces: [{ _id: mocks.correct.workspace_id }]
      });
      EntryMock.find = () => mocks.unsortedEntries;
      await entriesController.listEntriesByWorkspace(ctx, mocks.next);
      expect(ctx.status).toEqual(200);
      
      // expect(ctx.body[0].name).toEqual('User1');
      done();
    });

    test ("Returns status 404 if the Workspace is not found.", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.false.workspace_id);

      UserMock.findOne = () => ({
        workspaces: [{ _id: 0 }]
      });
      await entriesController.listEntriesByWorkspace(ctx, mocks.next);
      expect(ctx.status).toEqual(404);
      done();
    });

    test ("Sorts targeted `workspace.entries` array by name (ascending).", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      UserMock.findOne = () => ({ workspaces: [{ _id: mocks.correct.workspace_id }] });
      EntryMock.find = () => mocks.unsortedEntries;
      await entriesController.listEntriesByWorkspace(ctx, mocks.next);
      expect(ctx.body[0].name).toEqual('Entry1');
      done();
    });

    test ("Sorts Snapshots array of each Entry by date (oldest first).", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      UserMock.findOne = () => ({ workspaces: [{ _id: mocks.correct.workspace_id }] });
      
      EntryMock.find = () => ( [{ snapshots: mocks.unsortedSnapshots }] );
      await entriesController.listEntriesByWorkspace(ctx, mocks.next);
      expect(ctx.body[0].snapshots[0].date).toEqual('1991-01-01T00:00:00Z');
      done();
    });
  });

  describe("POST `/dashboard/:workspace_id/` --> .addEntry()", () => {
    test("If Entry name is provided and Workspace is found, returns status 201.", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      ctx.request.body = { name: 'Entry-name' };
      UserMock.findOne = () => mocks.user;
      EntryMock.create = () => mocks.unsortedEntries[0];
      await entriesController.addEntry(ctx, mocks.next);
      expect(ctx.status).toEqual(201);
      done();
    });

    test("Returns status 400 when Entry object is not available in `ctx.request.body`", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      ctx.request.body = {};
      UserMock.findOne = () => mocks.user;
      EntryMock.create = () => { name: undefined };
      await entriesController.addEntry(ctx, mocks.next);
      expect(ctx.status).toEqual(400);
      done();
    });

    test("Returns status 400 when `workspace_id` is not provided in `ctx.params`", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, undefined);
      ctx.request.body = { name: 'Entry-name' };
      UserMock.findOne = () => mocks.user;
      await entriesController.addEntry(ctx, mocks.next);
      expect(ctx.status).toEqual(400);
      done();
    });
    

    test("Returns the newly created Entry in the `ctx.body`", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      ctx.request.body = { name: 'Entry-name' };
      UserMock.findOne = () => mocks.user;
      
      EntryMock.create = () => (
        { name: 'Entry-name' , workspace: 'wkspc-id1'}
      );
      await entriesController.addEntry(ctx, mocks.next);
      expect(ctx.body).toEqual({ name: 'Entry-name', workspace: 'wkspc-id1'});
      done();
    });
  });

  describe ("DELETE  `/dashboard/:workspace_id/:entryId`  -->  .deleteEntry()", () => {
    test ('Returns status 400 when Entry Id is not provided `ctx.params`', async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      await entriesController.deleteEntry(ctx, mocks.next);
      // expect(ctx.status).toEqual(400);
      expect(ctx.body.errors).toEqual(['Entry Id or Workspace Id not provided!']);
      done();
    });

    test ('Returns status 400 when Workspace Id is not provided `ctx.params`', async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, undefined);
      ctx.params.entryId = '1';
      await entriesController.deleteEntry(ctx, mocks.next);
      // expect(ctx.status).toEqual(400);
      expect(ctx.body.errors).toEqual(['Entry Id or Workspace Id not provided!']);
      done();
    });

    test ('Removes the entry from the `targetedWorkspace.entries` array, return it in the `ctx.body`', async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id);
      ctx.params.entryId = '1';
      let userWithWorkspace = Object.assign({}, mocks.user);
      userWithWorkspace.workspaces = [ mocks.workspaceWithEntries ]
      UserMock.findOne = () => userWithWorkspace;
      await entriesController.deleteEntry(ctx, mocks.next);
      expect(ctx.status).toEqual(204);
      expect(ctx.body.length).toEqual(0);
      done();
    });

  });

});