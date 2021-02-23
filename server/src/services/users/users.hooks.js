const {authenticate} = require('@feathersjs/authentication').hooks;
const lget = require('lodash.get');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const initialChat = async context => {
  const userId = context.result._id;
  await context.app.service('chats').create({
    users: [{user: userId, unreadMessages: []}, {user: '603472e5e0c4550e71c2437e', unreadMessages: []}],
    messages: [{
      sentBy: '603472e5e0c4550e71c2437e',
      message: `Hi ${context.result.username}, welcome to Utah Gun Trade! Here you can send messages to others and negotiate on trades,offers, or other firearm related business. If you have any issues or questions don't hesitate to contact guntradesupport@gmail.com.`
    }]
  }).then((res) => {
    context.app.service('users').patch(userId, {chats: [res._id]});
  });
  return context;
};
const modifyWatched = async context => {
  let params = lget(context.arguments[1], 'params.name', '');
  let id = lget(context.arguments[1], 'params.id', '');
  if(params === 'watchedAdd') {
    let patchObj = {
      $push: {
        watchedBy: context.result._id
      }
    }
    context.app.service('listings').patch(id, patchObj);
  } else if(params === 'watchedRemove') {
    let patchObj = {
      $pull: {
        watchedBy: context.result._id
      }
    }
    context.app.service('listings').patch(id, patchObj);
  }
}



module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      hashPassword('password'),
    ],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      initialChat,
    ],
    update: [],
    patch: [modifyWatched],
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
