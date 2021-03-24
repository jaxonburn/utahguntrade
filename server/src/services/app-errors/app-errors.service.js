// Initializes the `appErrors` service on path `/app-errors`
const createService = require('feathers-mongoose');
const createModel = require('../../models/app-errors.model');
const hooks = require('./app-errors.hooks');
const filters = require('./app-errors.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'app-errors',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/app-errors', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('app-errors');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
