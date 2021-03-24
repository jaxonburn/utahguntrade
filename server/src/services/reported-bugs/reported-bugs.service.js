// Initializes the `reportedBugs` service on path `/reported-bugs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/reported-bugs.model');
const hooks = require('./reported-bugs.hooks');
const filters = require('./reported-bugs.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'reported-bugs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/reported-bugs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('reported-bugs');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
