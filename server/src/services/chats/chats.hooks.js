const { authenticate } = require('@feathersjs/authentication').hooks;
const { nestedfJoinHook } = require('../../hooks/common/fastJoin');
const { GeneralError } = require('@feathersjs/errors');
const { checkContext } = require('feathers-hooks-common');

const addMessageToUnread = (ctx) => {
  let sentBy = ctx.data.messages[ctx.data.messages.length - 1];
  let filterUsers = ctx.data.users.filter((user) => {
    return String(user.user) !== String(sentBy.sentBy);
  });
  filterUsers.forEach(user => {
    user.unreadMessages.push(sentBy.sentBy);
  });
  return ctx;
};

const addChatToUser = (ctx) => {
  let chatId = ctx.result._id;
  let users = ctx.result.users;
  users.forEach((user) => {
    ctx.app.service('users').patch(user.user, {$push: { chats: chatId}});
  });
  return ctx;
};

const checkIfChatExists = async (ctx) => {
  await ctx.app.service('chats').find({query: {'users.user': {$in: [ctx.data.users[0].user, ctx.data.users[1].user]}}}).then((res) => {
    if(res.data.length > 0){
      throw new GeneralError(String(res.data[0]._id));
    }else {
      return ctx;
    }
  });
  return ctx;
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      checkIfChatExists
    ],
    update: [],
    patch: [
      addMessageToUnread
    ],
    remove: []
  },

  after: {
    all: [
      nestedfJoinHook('users', 'users', 'user' )
    ],
    find: [],
    get: [],
    create: [
      addChatToUser,
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
