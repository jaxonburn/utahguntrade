// Initializes the `analytics` service on path `/analytics`
const createService = require('feathers-mongoose');
const createModel = require('../../models/analytics.model');
const hooks = require('./analytics.hooks');
const filters = require('./analytics.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'analytics',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/analytics', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('analytics');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
