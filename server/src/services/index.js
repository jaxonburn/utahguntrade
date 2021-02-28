const users = require('./users/users.service.js');
const listings = require('./listings/listings.service.js');
const chats = require('./chats/chats.service.js');
const tomtom = require('./tomtom/tomtom.service.js');
const articles = require('./articles/articles.service.js');
const documents = require('./documents/documents.service.js');
const stripeWebhook = require('./stripe-webhook/stripe-webhook.service.js');
const createCustomerPortalSession = require('./create-customer-portal-session/create-customer-portal-session.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(listings);
  app.configure(chats);
  app.configure(tomtom);
  app.configure(articles);
  app.configure(documents);
  app.configure(stripeWebhook);
  app.configure(createCustomerPortalSession);
};
