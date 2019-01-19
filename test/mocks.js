module.exports.User = {
  findOne: function (params) {
    let { _id } = params;
    for (let user of this.users) {
      if (user._id === _id) return user;
      else return {};
    }
  },

  users: [
    {
      _id: '11111',
      name: 'User1',
      email: 'user1@user1.com',
      password: '********',
      token: 'f28c4560-1a6c-11e9-9081-174d812cdb6f',
      workspaces: [
        {
          entries: [
            'entryid1111'
          ],
          _id: 'wkspc1',
          name: 'Workspace_1',
          template: {
            name: 'student',
            metrics: [
              'metric1'
            ]
          }
        },
        {
          entries: [
            'entryid2222'
          ],
          _id: 'wkspc2',
          name: 'Workspace_2',
          template: {
            name: 'student',
            enablers: [
              'metric1',
              'metric2',
              'metric3'
            ]
          }
        },
        {
          entries: [],
          _id: '5c40baefd9c7a82588d22954',
          name: 'Workspace_3',
          template: {
            name: 'student',
            metrics: [
              'metric1'
            ]
          }
        }
      ],
    },
    {
      _id: '22222',
      name: 'User2',
      email: 'user2@user2.com',
      password: '********',
      token: 'f28c4560-1a6c-35e0-9081-174d812qwe49',
      workspaces: [
        {
          entries: [
            '5c40a2c85ad0ee7964bbb975'
          ],
          _id: '5c40a0a45ad0ee7964bbb971',
          name: 'Workspace_1',
          template: {
            name: 'student',
            metrics: [
              'metric1'
            ]
          }
        },
        {
          entries: [
            '5c40ad6a3ff38a13d56c9999'
          ],
          _id: '5c40ad623xx38a13d56c855f',
          name: 'Workspace_2',
          template: {
            name: 'student',
            enablers: [
              'metric1',
              'metric2',
              'metric3'
            ]
          }
        },
        {
          entries: [],
          _id: '5c35baefd9c7a81118d22954',
          name: 'Workspace_3',
          template: {
            name: 'student',
            metrics: [
              'metric1'
            ]
          }
        }
      ],
    }
  ]
};

module.exports.Entry = {
  find: function (params) {
    let idsArray = params._id.$in;
    let result = [];

    for (let wantedEntry_id of idsArray) {
      this.entries.filter( entry => {
        if (entry._id === wantedEntry_id) result.push(entry);
      });
    }
    return result;
  },
  
  entries: [
    {
      _id: "entryid1111",
      name: "Entry-name1",
      workspace: "wkspc1",
      snapshots: [
        {
          comments: [""],
          metrics: [
            {
              label: "Frontend",
              score: 0.2
            }
          ],
          _id: "snapshotid1111",
          date: "2019-01-17T00:00:00Z"
        }
      ],
    },
    {
      _id: "entryid2222",
      name: "Entry-name2",
      workspace: "wkspc2",
      snapshots: [
        {
          comments: [""],
          metrics: [
            {
              label: "Backend",
              score: 0.1
            }
          ],
          _id: "snapshotid2222",
          date: "2019-01-17T00:00:00Z"
        },
      ],
    }
  ]
}

module.exports.correct = {
  user_id: '11111',
  workspace_id: 'wkspc1'
}

module.exports.false = {
  workspace_id: 'falsewkspc1',
  user_id: 'xxxxx'
}


class ctx {
  constructor (userId , workspaceId) {
    this.user = {
      _id: userId, 
    };
    this.params = {
      workspace_id: workspaceId
    }
  }
};

module.exports.ctx = ctx;
module.exports.next = () => {
  return; 
};
