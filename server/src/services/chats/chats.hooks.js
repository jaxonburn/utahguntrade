const { authenticate } = require('@feathersjs/authentication').hooks;
const { fJoinHook } = require('../../hooks/common/fastJoin');
const { GeneralError } = require('@feathersjs/errors');


const addChatToUser = (ctx) => {
  let chatId = ctx.result._id;
  let users = ctx.result.users;
  users.forEach((user) => {
    ctx.app.service('users').patch(user, {$push: { chats: chatId}});
  });
  return ctx;
};

const checkIfChatExists = async (ctx) => {
  await ctx.app.service('chats').find({query: {users: {$in: [ctx.data.users]}}}).then((res) => {
    if(res.data.length > 0){
      throw new GeneralError('Chat Already Exists');
    }else {
      return ctx;
    }
  });
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
