'use strict';

const User = require('../models/user.model');
const Entry = require('../models/entry.model');

// Get all Entries
module.exports.listEntriesByWorkspace = async (ctx, next) => {
  //redundant
  if ('GET' != ctx.method) return await next();


  /*   const user = await User.findOne({'_id': ctx.user._id});
   */
  const user = ctx.user;
  const targetWorkspace = await user.workspaces.filter(el => el._id == ctx.params.id);
  if (targetWorkspace.length == 0) {
    ctx.status = 404;
    ctx.body = {
      errors: [
        'Workspace not found!'
      ]
    };
    return await next();
  }
  let current;

  let allEntries = await Entry.find({ _id: { $in: targetWorkspace[0].entries } });
  let sortedEntries = [];

  for (let x = 0; x < allEntries.length; x++) {
    current = allEntries[x];
    current.snapshots.sort((a, b) => a.date - b.date);
    sortedEntries.push(current);
  }

  sortedEntries.sort((a, b) => {
    const A = a.name.toUpperCase();
    const B = b.name.toUpperCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
  ctx.status = 200;
  ctx.body = sortedEntries;
};

// Adding a new Entry
module.exports.addEntry = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  if (!ctx.request.body.name) {
    ctx.status = 400;
    ctx.body = {
      errors: [
        'Name cannot be empty!'
      ]
    };
    return await next();
  }
  const user = await User.findOne({ '_id': ctx.user._id });
  const targetWorkspace = await user.workspaces.filter(el => el._id == ctx.params.id);
  const entry = await Entry.create({
    name: ctx.request.body.name,
    workspace: ctx.params.id
  });
  targetWorkspace[0].entries.push(entry._id)
  await user.save();
  ctx.status = 201;
  ctx.body = entry;
};

// Deleting an existing Entry
module.exports.deleteEntry = async (ctx, next) => {
  if ('DELETE' != ctx.method) return await next();
  const user = await User.findOne({ '_id': ctx.user._id });
  const targetWorkspace = await user.workspaces.filter(el => el._id == ctx.params.id);
  if (targetWorkspace[0].entries.indexOf(ctx.params.entryId) === -1) {
    ctx.status = 404;
    ctx.body = {
      errors: [
        'No entry found!'
      ]
    };
    return await next();
  }
  targetWorkspace[0].entries.splice(targetWorkspace[0].entries.indexOf(ctx.params.entryId), 1);
  await user.save();
  ctx.status = 204;
}
