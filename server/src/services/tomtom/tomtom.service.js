// Initializes the `tomtom` service on path `/tomtom`
const { Tomtom } = require('./tomtom.class');
const hooks = require('./tomtom.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tomtom', new Tomtom(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tomtom');

  service.hooks(hooks);
};
