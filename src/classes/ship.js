function Ship() {
  let length = 0;
  let timesHit = 0;
  
  const hit = () => timesHit += 1;
  const isSunk = () => timesHit === length;

  return { length, timesHit, hit, isSunk };
}

module.exports = Ship;