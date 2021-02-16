const { authenticate } = require('@feathersjs/authentication').hooks;
const { fJoinHook } = require('../../hooks/common/fastJoin');

const addChatToUser = (ctx) => {
  let chatId = ctx.result._id;
  let users = ctx.result.users;
  users.forEach((user) => {
    ctx.app.service('users').patch(user, {$push: { chats: chatId}});
  });

};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      fJoinHook('users', 'users')
    ],
    get: [],
    create: [
      addChatToUser
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
