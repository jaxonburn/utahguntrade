const assert = require('assert');
const app = require('../../src/app');

describe('\'appErrors\' service', () => {
  it('registered the service', () => {
    const service = app.service('app-errors');

    assert.ok(service, 'Registered the service');
  });
});
