const assert = require('assert');
const app = require('../../src/app');

describe('\'reports\' service', () => {
  it('registered the service', () => {
    const service = app.service('reports');

    assert.ok(service, 'Registered the service');
  });
});
