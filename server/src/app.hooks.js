
// Application hooks that run for every service
const {paramsFromClient} = require('feathers-hooks-common');

const removeFastJoin = require('./hooks/common/remove-fastjoin');

module.exports = {
  before: {
    all: [
      paramsFromClient(),
      removeFastJoin()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
