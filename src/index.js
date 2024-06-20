import './sass/style.scss';
import './classes/gameboard.js';
import './classes/ship.js';
import './ui.js';

const Gameboard = require('./classes/gameboard.js');
const UI = require('./ui.js');

let gameboardOne = {
  'data': Gameboard(),
  'ui': UI.createGameboardUI(true)
}

let gameboardTwo = {
  'data': Gameboard(),
  'ui': UI.createGameboardUI(false)
}

const main = document.getElementsByTagName('main')[0];
main.appendChild(gameboardOne.ui);
main.appendChild(gameboardTwo.ui);

gameboardOne.ui.addEventListener('cellClicked', (event) => {
  console.log(event.detail);
});