const assert = require('assert');
const app = require('../../src/app');

describe('\'stripe-webhook\' service', () => {
  it('registered the service', () => {
    const service = app.service('stripe-webhook');

    assert.ok(service, 'Registered the service');
  });
});
