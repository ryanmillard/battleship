const Ship = require('./ship.js');

function Gameboard() {
  let gameboard = [];
  let ships = [];
  for (let x = 0; x < 10; x++) {
    gameboard[x] = [];
    for (let y = 0; y < 10; y++) {
      gameboard[x][y] = null;
    }
  }
  console.log(gameboard);
}

module.exports = Gameboard;