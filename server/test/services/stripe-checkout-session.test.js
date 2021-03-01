const assert = require('assert');
const app = require('../../src/app');

describe('\'stripeCheckoutSession\' service', () => {
  it('registered the service', () => {
    const service = app.service('stripe-checkout-session');

    assert.ok(service, 'Registered the service');
  });
});
