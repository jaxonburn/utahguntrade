
// Application hooks that run for every service
const {paramsFromClient} = require('feathers-hooks-common');

const removeFastJoin = require('./hooks/common/remove-fastjoin');

module.exports = {
  before: {
    all: [
      paramsFromClient('$options', '$regex'),
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
    all: [ctx => {
      ctx.app.service('app-errors').create({type: ctx.error.type, className: ctx.error.className, code: ctx.error.code});
    }],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
