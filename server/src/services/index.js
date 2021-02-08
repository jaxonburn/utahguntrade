const users = require('./users/users.service.js');
const listings = require('./listings/listings.service.js');
const chats = require('./chats/chats.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(listings);
  app.configure(chats);
};
