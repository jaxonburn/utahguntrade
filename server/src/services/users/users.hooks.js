const {authenticate} = require('@feathersjs/authentication').hooks;
const lget = require('lodash.get');
// eslint-disable-next-line no-unused-vars
const {checkContext} = require('feathers-hooks-common');

const {preventChanges} = require('feathers-hooks-common');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const initialChat = async context => {
  const userId = context.result._id;
  await context.app.service('chats').create({
    users: [{user: userId, unreadMessages: []}, {user: '60f9f1a9b0427d0ed4d1fb39', unreadMessages: []}],
    messages: [{
      sentBy: '60f9f1a9b0427d0ed4d1fb39',
      message: `Hi ${context.result.username}, welcome to Utah Gun Trade! Here you can send messages to others and negotiate on trades,offers, or other firearm related business. If you have any issues or questions don't hesitate to contact support@utahgunhub.com.`
    }]
  }).then((res) => {
    context.app.service('users').patch(userId, {chats: [res._id]});
  });
  return context;
};

const modifyWatched = async context => {
  let params = lget(context.arguments[1], 'params.name', '');
  let id = lget(context.arguments[1], 'params.id', '');
  if (params === 'watchedAdd') {
    let patchObj = {
      $push: {
        watchedBy: context.result._id
      }
    };
    context.app.service('listings').patch(id, patchObj);
  } else if (params === 'watchedRemove') {
    let patchObj = {
      $pull: {
        watchedBy: context.result._id
      }
    };
    context.app.service('listings').patch(id, patchObj).then(res => console.log(res)).catch(err => console.log(err));
  }
};

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt')
    ],
    get: [
      authenticate('jwt')
    ],
    create: [
      hashPassword('password'),
    ],
    update: [
      authenticate('jwt')
    ],
    patch: [
      authenticate('jwt'),
      // preventChanges(
      //   true,
      //   'facebookId',
      //   'role',
      //   'googleId',
      //   'stripeId'
      // ),
    ],
    remove: [
      authenticate('jwt')
    ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [
      initialChat
    ],
    update: [],
    patch: [modifyWatched],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
