const {authenticate} = require('@feathersjs/authentication').hooks;
const {fJoinHook} = require('../../hooks/common/fastJoin');

const removeFromUser = async context => {
  // let patchObj = {
  //   $pull: {
  //     notifications: context.arguments[0]
  //   }
  // }
  let user = context.params.user;
  user.notifications = user.notifications.filter(noti => {
    return String(noti) !== String(context.arguments[0]);
  });
  await context.app.service('users').patch(user._id, user);
  return context;
}

const setDeleted = async context => {
  await context.app.service('notifications').patch(context.data._id, {deleted: true}).then(res => {
    console.log(res);
  })
  return context;
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [fJoinHook('messageObj.sentBy', 'users')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [removeFromUser]
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
