const {fastJoin} = require('feathers-hooks-common');
const lget = require('lodash.get');
const lset = require('lodash.set');
const nestedfJoinHook = function (path, service, idKey) {
  let resolver = {
    joins: {
      // eslint-disable-next-line no-unused-vars
      set: $select => async (data, context) => {
        let items = lget(data, path, []);
        let ids = items.map(item => item[idKey]);
        if (ids.length > 0) {
          let items_res = await context.app.service(`${service}`).find({
            query: {
              _id: ids
            }
          });
          let queriedItems = items_res.data;
          console.log('queryed items', queriedItems);
          // let fastJoin_items = items.map(item => {
          //   return lset(Object.assign({}, item),
          //     idKey,
          //     queriedItems.find(query => {
          //       return String(query._id) === String(item[idKey]) || item[idKey];
          //     })
          //   );
          // });
          lset(data, `_fastjoin.${path}`, queriedItems);
        }
      }
    }
  };
  return fastJoin(resolver);
};
const fJoinHook = function (path, service, queryPath = '_id') {
  let resolver = {
    joins: {
      // eslint-disable-next-line no-unused-vars
      set: $select => async (item, context) => {
        let ids = Array.isArray(lget(item, path)) ? lget(item, path, []) : String(lget(item, path, ''));
        let newItems;
        if (ids.length > 0) {
          let queried = await context.app.service(`${service}`).find({
            query: {
              [queryPath]: ids
            }
          });
          newItems = Array.isArray(ids) ? queried.data : queried.data[0];
        }
        lset(item, `_fastjoin.${path}`, newItems);
      }
    }
  };
  return fastJoin(resolver);
};
module.exports = {
  nestedfJoinHook,
  fJoinHook
};
