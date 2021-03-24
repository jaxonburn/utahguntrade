const assert = require('assert');
const app = require('../../src/app');

describe('\'analytics\' service', () => {
  it('registered the service', () => {
    const service = app.service('analytics');

    assert.ok(service, 'Registered the service');
  });
});
