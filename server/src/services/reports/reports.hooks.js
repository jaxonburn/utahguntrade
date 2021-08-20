// const {fJoinHook} = require('../../hooks/common/fastJoin');
const {fastJoin} = require('feathers-hooks-common');
const lset = require('lodash.set');

const checkIfExists = async ctx => {
  ctx.data.createdBy = ctx.params.user._id;
  let data = await ctx.app.service('reports').find({query: {dataId: ctx.data.dataId, createdBy: ctx.params.user._id}});
  if (data.total > 0) {
    throw new Error('You have already reported this, thank you for your feedback');
  } else {
    return ctx;
  }
};

let resolver = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    set: $select => async (item, context) => {
      let ids = String(item['dataId']);
      let service = item.service;
      let newItems;
      if (ids.length > 0) {
        let queried = await context.app.service(`${service}`).find({
          query: {
            _id: ids
          }
        });
        newItems = queried.data[0];
        console.log(newItems);
      }
      lset(item, '_fastjoin.data', newItems);
    }
  }
};


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkIfExists],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [fastJoin(resolver)],
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
