import './sass/style.scss';
import './classes/gameboard.js';
import './classes/ship.js';
import './ui.js';

const Gameboard = require('./classes/gameboard.js');
const UI = require('./ui.js');

const main = document.getElementsByTagName('main')[0];
const planningGrid = document.getElementsByClassName('planning-grid')[0];

function createSelectionUI() {
  let shipSelectionBoard = {
    'data': Gameboard(),
    'ui': UI.createGameboardUI(true)
  }

  shipSelectionBoard.ui.style.width = '70%';
  shipSelectionBoard.ui.style.height = '70%';
  shipSelectionBoard.ui.style.aspectRatio = '1';

  planningGrid.prepend(shipSelectionBoard.ui);
}

createSelectionUI();
// let gameboardOne = {
//   'data': Gameboard(),
//   'ui': UI.createGameboardUI(true)
// }

// let gameboardTwo = {
//   'data': Gameboard(),
//   'ui': UI.createGameboardUI(false)
// }

// main.appendChild(gameboardOne.ui);
// main.appendChild(gameboardTwo.ui);

// gameboardOne.ui.addEventListener('cellClicked', (event) => {
//   console.log(event.detail);
// });

// gameboardTwo.ui.addEventListener('cellClicked', (event) => {
//   console.log(event.detail);
// });