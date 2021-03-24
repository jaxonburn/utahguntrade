const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {
  app.use('/mailer', Mailer(smtpTransport({
    host: 'email-smtp.us-west-1.amazonaws.com',
    secure: true,
    auth: {
      user: process.env.SES_USER,
      pass: process.env.SES_PASS
    }
  })));

  const service = app.service('mailer');
  service.hooks(hooks);
};
