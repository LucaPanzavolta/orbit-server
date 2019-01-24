'use strict';

function SnapshotsController(EntryModel) {

  return {
    // Add a new snapshot
    addSnapshot: async function (ctx, next) {
      if ('POST' != ctx.method) return await next();
      if (!ctx.request.body.date || !ctx.request.body.score || !ctx.request.body.label) {
        ctx.status = 404;
        ctx.body = {
          errors: [
            'Date, label and score are mandatory fields'
          ]
        };
        return await next();
      }

      console.log('THIS ', this);
      const targetEntry = await EntryModel.findOne({ '_id': ctx.params.entryId });
      console.log('TARGET ENTRY ', targetEntry);

      const snapshot = {
        date: ctx.request.body.date,
        comment: ctx.request.body.comment || "",
        label: ctx.request.body.label,
        score: ctx.request.body.score
      }

      await targetEntry.snapshots.push(snapshot)
      await targetEntry.save();
      ctx.status = 201;
      ctx.body = snapshot;
    },

    // Delete a snapshot
    deleteSnapshot: async function (ctx, next) {
      const targetEntry = await EntryModel.findOne({ '_id': ctx.params.entryId });
      let newSnapshots = [];
      if (targetEntry) {
        newSnapshots = await targetEntry.snapshots.filter(el => el._id != ctx.params.snapId);
      }
      if (newSnapshots.length === targetEntry.snapshots.length) {
        ctx.status = 404;
        ctx.body = {
          errors: [
            'Snapshot not found!'
          ]
        };
        return await next();
      }
      await EntryModel.findOneAndUpdate({ '_id': ctx.params.entryId }, { snapshots: newSnapshots });
      ctx.status = 204;
    }
  }
}

module.exports = SnapshotsController;


























