const { authenticate } = require('@feathersjs/authentication').hooks;
const { fJoinHook } = require('../../hooks/common/fastJoin');

const addToUser = context => {
  if(context.result.listedBy) {
    let patchObj = {
      $push: {
        listings: context.result._id
      }
    }
    context.app.service('users').patch(context.result.listedBy, patchObj);
  }
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [fJoinHook('listedBy', 'users')],
    find: [],
    get: [],
    create: [addToUser],
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
