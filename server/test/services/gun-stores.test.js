const assert = require('assert');
const app = require('../../src/app');

describe('\'gun-stores\' service', () => {
  it('registered the service', () => {
    const service = app.service('gun-stores');

    assert.ok(service, 'Registered the service');
  });
});
