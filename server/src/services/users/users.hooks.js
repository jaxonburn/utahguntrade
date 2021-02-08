const {authenticate} = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const initialChat = async context => {
  const userId = context.result._id;
  await context.app.service('chats').create({
    users: [userId, '602085c010e8256c59c339a2'],
    messages: [{
      sentBy: '602085c010e8256c59c339a2',
      message: `Hi ${context.result.username}, welcome to Utah Gun Trade! Here you can send messages to others and negotiate on trades,offers, or other firearm related business. If you have any issues or questions don't hesitate to contact guntradesupport@gmail.com.`
    }]
  }).then((res) => {
    context.app.service('users').patch(userId, {chats: [res._id]});
  });
  return context;
};



module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword('password')],
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
