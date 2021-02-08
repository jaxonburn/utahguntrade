// Initializes the `listings` service on path `/listings`
const { Listings } = require('./listings.class');
const createModel = require('../../models/listings.model');
const hooks = require('./listings.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/listings', new Listings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('listings');

  service.hooks(hooks);
};
