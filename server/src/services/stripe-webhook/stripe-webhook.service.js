// Initializes the `stripe-webhook` service on path `/stripe-webhook`
const { StripeWebhook } = require('./stripe-webhook.class');
const hooks = require('./stripe-webhook.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/stripe-webhook', new StripeWebhook(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('stripe-webhook');

  service.hooks(hooks);
};
