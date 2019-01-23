'use strict';

const User = require('../models/user.model');
const Entry = require('../models/entry.model');
const Category = require('../models/category.model');

// Add a new snapshot
module.exports.addSnapshot = async (ctx, next) => {
  console.log('CTX.REQ.BODY ', ctx.request.body);
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
  const user = await User.findOne({ '_id': ctx.user._id });
  const test = user.workspaces.filter(el => el._id == ctx.params.id);
  console.log('test', test);

  //const categoryId = user.workspaces.filter(el => el._id == ctx.params.id)[0].category;
  // const category = await Category.findById(categoryId);

  const targetEntry = await Entry.findOne({ '_id': ctx.params.entryId });
  console.log('TARGET ENTRY ', targetEntry);

  const targetEntry = await Entry.findOne({'_id': ctx.params.entryId});

  const snapshot = {
    date: ctx.request.body.date,
    comment: ctx.request.body.comment || "",
    label: ctx.request.body.label,
    score: ctx.request.body.score
  }

  console.log('snapshot', snapshot);
  await targetEntry.snapshots.push(snapshot)
  await targetEntry.save();
  ctx.status = 201;
  ctx.body = snapshot;
}

// Delete a snapshot
module.exports.deleteSnapshot = async (ctx, next) => {
  const targetEntry = await Entry.findOne({ '_id': ctx.params.entryId });
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
  await Entry.findOneAndUpdate({ '_id': ctx.params.entryId }, { snapshots: newSnapshots });
  ctx.status = 204;
}
