const checkIfExists = async ctx => {
  ctx.data.createdBy = ctx.params.user._id;
  let data = await ctx.app.service('reports').find({query: {dataId: ctx.data.dataId, createdBy: ctx.params.user._id}});
  if (data.total > 0) {
    throw new Error('You have already reported this, thank you for your feedback');
  } else {
    return ctx;
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
