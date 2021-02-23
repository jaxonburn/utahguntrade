const assert = require('assert');
const app = require('../../src/app');

describe('\'tomtom\' service', () => {
  it('registered the service', () => {
    const service = app.service('tomtom');

    assert.ok(service, 'Registered the service');
  });
});
