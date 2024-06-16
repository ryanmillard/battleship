const Ship = require('../classes/ship.js');

describe('Ship Class', () => {
  it('generates attributes', () => {
    let x = Ship();
    expect(x.length).toBe(0);
    expect(x.timesHit).toBe(0);
  });
});