/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');

const server = app.listen(port);


process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
//
// /* eslint-disable no-console */

// const logger = require('./logger');
// const app = require('./app');
// const port = app.get('port');
// const https = require('https');
// const fs = require('fs');
//
// const server = https.createServer({
//   key: fs.readFileSync('/etc/letsencrypt/live/gunhubutah.com/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/gunhubutah.com/cert.pem'),
//   requestCert: false,
//   rejectUnauthorized: false
// }, app).listen(port);
//
// app.setup(server);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
