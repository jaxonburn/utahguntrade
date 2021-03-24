const assert = require('assert');
const app = require('../../src/app');

describe('\'reportedBugs\' service', () => {
  it('registered the service', () => {
    const service = app.service('reported-bugs');

    assert.ok(service, 'Registered the service');
  });
});
