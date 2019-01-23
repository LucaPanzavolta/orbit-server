'use strict';
const { HttpError } = require('./../services/utils');

class EntriesController {
  constructor(UserModel, EntryModel) {
    this.UserModel = UserModel;
    this.EntryModel = EntryModel;
    this.listEntriesByWorkspace = this.listEntriesByWorkspace.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
  }
  
  // Get all Entries in a Workspace
  async listEntriesByWorkspace(ctx, next) {

    // Consider to Refactor the below line to : `const user = ctx.user;`
    const user = await this.UserModel.findOne({ _id: ctx.user._id });

    if (user.workspaces === undefined) user.workspaces = [];
    const targetWorkspace = await user.workspaces.find(el => el._id == ctx.params.workspace_id);
    // If Workspace NOT found
    if (targetWorkspace === undefined) {
      ctx.status = 404;
      ctx.body = { errors: ['Workspace not found!'] };
      return await next();
    }
    // console.log('targetWorkspace', targetWorkspace);
    // Get Entries in this Workspace from DB
    let allEntries = await this.EntryModel.find({ _id: { $in: targetWorkspace.entries } });
    let sortedEntries = [];
    let currentEntry;
    // For each Entry - sort Snapshot's by date
    for (let x = 0; x < allEntries.length; x++) {
      currentEntry = allEntries[x];
      currentEntry.snapshots.sort((a, b) => new Date(a.date) - new Date(b.date));
      sortedEntries.push(currentEntry);
    }
    // Sort all Entries by name
    sortedEntries.sort((a, b) => {
      const A = a.name.toUpperCase();
      const B = b.name.toUpperCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
    ctx.status = 200;
    ctx.body = sortedEntries;
  }

  // Adding a new Entry
  async addEntry(ctx, next) {
    if (!ctx.request.body.name) {
      ctx.status = 400;
      ctx.body = { errors: ['Name cannot be empty!'] };
      return await next();
    }

    // Consider to Refactor the below line to : `const user = ctx.user;`
    const user = await this.UserModel.findOne({ '_id': ctx.user._id });

    const targetWorkspace = await user.workspaces.find((el) => el._id == ctx.params.workspace_id);
    
    if (!targetWorkspace) {
      ctx.status = 400;
      ctx.body = { errors: ['Workspace not found!'] };
      // throw new HttpError(`Workspace not found!  -  addEntry()`, 400);
      return await next();
    }
    const entry = await this.EntryModel.create({
      name: ctx.request.body.name,
      workspace: ctx.params.workspace_id
    });
    // Add Entry to the Workspace
    targetWorkspace.entries.push(entry._id);
    await user.save();
    ctx.status = 201;
    ctx.body = entry;
  }

  // Deleting an existing Entry
  async deleteEntry(ctx, next) {

    if (!ctx.params.entryId || !ctx.params.workspace_id) {
      ctx.status = 400;
      ctx.body = { errors: ['Entry Id or Workspace Id not provided!'] };
      return await next();
    }

    // Consider to Refactor the below line to : `const user = ctx.user;`
    const user = await this.UserModel.findOne({ '_id': ctx.user._id });

    const targetWorkspace = await user.workspaces.find(el => el._id == ctx.params.workspace_id);

    // If No Entry Found
    let entryIndex = targetWorkspace.entries.findIndex( (obj) => {
      return obj._id == ctx.params.entryId;
    });
    
    if (entryIndex === -1) {
      ctx.status = 404;
      ctx.body = { errors: ['No entry found!'] };
      return await next();
    }
    // If Entry found - remove it 
    else {
      targetWorkspace.entries.splice(entryIndex, 1);
      await user.save();
      ctx.body = targetWorkspace.entries;
      ctx.status = 204;
    }
  }
};

module.exports = EntriesController;
