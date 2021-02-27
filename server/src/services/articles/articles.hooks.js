const {authenticate} = require('@feathersjs/authentication').hooks;
const {fastJoin} = require('feathers-hooks-common');
const lset = require('lodash.set');
const lget = require('lodash.get');

const userResolver = {

  joins: {
    // eslint-disable-next-line no-unused-vars
    setCommentsUser: $select => async (article, context) => {
      let comments = lget(article, 'comments', []);
      let user_ids = comments.map(comment => comment.sentBy);
      if (user_ids.length > 0) {
        let users_res = await context.app.service('users').find({
          query: {
            _id: user_ids
          }
        });
        let users = users_res.data;

        let fatjoin_comments = comments.map(comment => {
          return lset(Object.assign({}, comment),
            'user',
            users.find(user => String(user._id) === String(comment.sentBy)) || comment.sentBy);
        });
        lset(article, '_fastjoin.comments', fatjoin_comments);
      }
    },
  }
};

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
    all: [
      fastJoin(userResolver)
    ],
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
