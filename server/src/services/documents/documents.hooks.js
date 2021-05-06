const { authenticate } = require('@feathersjs/authentication').hooks;

const attachToListing = context => {
  console.log(context.result);
  if(context.result.listing) {
    let patchObj = {
      document: context.result
    };
    context.app.service('listings').patch(context.result.listing, patchObj);
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
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
    create: [attachToListing],
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
