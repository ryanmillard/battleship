import './sass/style.scss';
import './classes/gameboard.js';
import './classes/ship.js';
import './ui.js';

const Gameboard = require('./classes/gameboard.js');
const UI = require('./ui.js');

let gameboardOne = Gameboard();
let gameboardTwo = Gameboard();
console.log("hello!");

let boardOne = UI.createGameboardUI();
document.body.append(boardOne);