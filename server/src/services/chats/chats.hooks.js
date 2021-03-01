const { authenticate } = require('@feathersjs/authentication').hooks;
const { nestedfJoinHook } = require('../../hooks/common/fastJoin');
const { GeneralError } = require('@feathersjs/errors');
const { checkContext } = require('feathers-hooks-common');

const addMessageToUnread = async (ctx) => {
  let sentBy = ctx.data.messages[ctx.data.messages.length - 1];
  let filterUsers = ctx.data.users.filter((user) => {
    return String(user.user) !== String(sentBy.sentBy);
  });
  let noti = {
    modelId: ctx.data._id,
    text: sentBy.message,
    type: 'Chat',
    messageObj: sentBy
  };
  await ctx.app.service('notifications').create(noti).then(res => {
    filterUsers.forEach(user => {
      user.unreadMessages.push(sentBy.sentBy);
      ctx.app.service('users').patch(user.user, { $push: { notifications: res._id } });
    });
  }).catch(err => {
    console.log('SOmething wernt wrong when adding notification on chats: ', err.message);
    filterUsers.forEach(user => {
      user.unreadMessages.push(sentBy.sentBy);
    });
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
  await ctx.app.service('chats').find({query: {'users.user': {$all: [ctx.data.users[0].user, ctx.data.users[1].user]}}}).then((res) => {
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
