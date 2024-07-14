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
  let shipID = null;
  let timesHit = 0;
  let isPlaced = false;
  let isHorizontal = true;
  let coordinates = [];
  let isVisible = false;
  let length = 0;
  
  const hit = () => { timesHit += 1 };
  const isSunk = () => timesHit === length;
  const getTimesHit = () => timesHit;

  return {
    shipID,
    isPlaced,
    isHorizontal,
    isVisible,
    coordinates,
    setLength: (len) => length = len, 
    hit,
    isSunk,
    getTimesHit
  };
}

module.exports = { Ship, shipData };