const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = function (app) {
  mongoose.connect(
    app.get('mongodb'),
    { useCreateIndex: true, useNewUrlParser: true }
  ).then(() => {
    console.log('Database Connected');
  }).catch(err => {
    logger.error(err);
    process.exit(1);
  });




  app.set('mongooseClient', mongoose);
};
