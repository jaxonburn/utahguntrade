// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const get = require('lodash.get');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let fastjoin = get(context.data, '_fastjoin');
    if (fastjoin) delete context.data['_fastjoin'];
    return context;
  };
};
