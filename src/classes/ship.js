const shipData = [
  {
    "name": "Destroyer",
    "length": 5
  },
  {
    "name": "Battleship",
    "length": 4
  },
  {
    "name": "Cruiser",
    "length": 3
  },
  {
    "name": "Submarine",
    "length": 3
  },
  {
    "name": "Destroyer",
    "length": 2
  }
];

function Ship() {
  let length = 0;
  let timesHit = 0;
  
  const hit = () => timesHit += 1;
  const isSunk = () => timesHit === length;

  return { length, timesHit, hit, isSunk };
}

module.exports = { Ship, shipData };