const assert = require('assert');
const app = require('../../src/app');

describe('\'listings\' service', () => {
  it('registered the service', () => {
    const service = app.service('listings');

    assert.ok(service, 'Registered the service');
  });
});
