
// Application hooks that run for every service
const {paramsFromClient} = require('feathers-hooks-common');

const removeFastJoin = require('./hooks/common/remove-fastjoin');

module.exports = {
  before: {
    all: [
      paramsFromClient('$options', '$regex', 'boring'),
      removeFastJoin(),
      ctx => {
        if(ctx.params.boring === ctx.app.get('boring') || ctx.params.query._id) {
          // console.log(ctx.params.boring === ctx.app.get('boring'));
        } else {
          throw new Error('Must be origin URL');
        }
      },
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
      if(ctx.error && ctx.error.type) {
        ctx.app.service('app-errors').create({type: ctx.error.type, className: ctx.error.className, code: ctx.error.code});
      }
    }],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
