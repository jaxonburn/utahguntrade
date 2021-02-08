export default async ( { Vue } ) => {
  Vue.prototype.$lget = require('lodash.get');
  Vue.prototype.$lset = require('lodash.set');
};

