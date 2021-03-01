const assert = require('assert');
const app = require('../../src/app');

describe('\'create-customer-portal-session\' service', () => {
  it('registered the service', () => {
    const service = app.service('create-customer-portal-session');

    assert.ok(service, 'Registered the service');
  });
});
