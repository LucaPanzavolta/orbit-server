const mocks = require('./mocks');
const EntryMock = {};

const SnapshotsController = require("../controllers/snapshots.controller");
const next = () => { };

describe("Testing for Snapshot controller", () => {
  describe("POST method - Adding new Snapshot", () => {
    test("Adding new snapshot forbidden if score property is missing on ctx.body", async (done) => {
      const ctx = new mocks.ctx(mocks.correct.user_id, mocks.correct.workspace_id, mocks.correct.entry_id);

      ctx.method = "POST";
      ctx.request.body = {
        date: "2001-10-10T03:24:00",
        comments: "comment to the third snapshot",
        label: "backend",
        score: undefined // score property not passed in the ctx.request.body
      };

      EntryMock.findOne = () => mocks.sigleEntry;
      await SnapshotsController(EntryMock).addSnapshot(ctx, next);

      expect(ctx.status).toEqual(404);
      expect(ctx.body).toEqual({ errors: ['Date, label and score are mandatory fields'] });

      done();
    });
  });
});
