// Initializes the `create-customer-portal-session` service on path `/create-customer-portal-session`
const { CreateCustomerPortalSession } = require('./create-customer-portal-session.class');
const hooks = require('./create-customer-portal-session.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/create-customer-portal-session', new CreateCustomerPortalSession(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('create-customer-portal-session');

  service.hooks(hooks);
};
