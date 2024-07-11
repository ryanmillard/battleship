import './sass/style.scss';
import './classes/gameboard.js';
import './classes/ship.js';

import carrierSVG from './assets/images/carrier.svg';
import battleshipSVG from './assets/images/battleship.svg';
import cruiserSVG from './assets/images/cruiser.svg';
import submarineSVG from './assets/images/submarine.svg';
import destroyerSVG from './assets/images/destroyer.svg';

const shipImages = [carrierSVG, battleshipSVG, cruiserSVG, submarineSVG, destroyerSVG];

const Gameboard = require('./classes/gameboard.js');

const main = document.getElementsByTagName('main')[0];
const planningWrapper = document.getElementsByClassName('planning-wrapper')[0];
const planningGrid = document.getElementsByClassName('planning-grid')[0];

const planningGameboard = Gameboard(planningGrid, shipImages, true);

const shipRotateBtn = document.getElementById('ship-rotate-btn');
const shipResetBtn = document.getElementById('ship-reset-btn');
const planningConfirmBtn = document.getElementById('planning-confirm-btn');

const draggablesContainer = document.getElementsByClassName('draggables-container')[0];
const draggables = draggablesContainer.children;

const gameWrapper = document.getElementsByClassName('game-wrapper')[0];

const p1GameboardContainer = document.getElementById('p1-gameboard');
const p2GameboardContainer = document.getElementById('p2-gameboard');

const gameboardOne = Gameboard(p1GameboardContainer, shipImages, true);
gameboardOne.addGameboardTitle('FRIENDLY WATERS');

const gameboardTwo = Gameboard(p2GameboardContainer, shipImages, false);
gameboardTwo.addGameboardTitle('ENEMY WATERS');

for (let i = 0; i < draggables.length; i++) {
  draggables[i].addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('draggingShipID', i);
  });
}

function changeDraggableShipState(shipID, enabled) {
  let item = draggables[shipID]
  item.draggable = enabled;
  item.style.cursor = enabled ? 'grab' : 'not-allowed';
  for (let i = 0; i < item.children.length; i++) {
    item.children[i].style.visibility = enabled ? 'visible' : 'hidden';
  }
}

planningGameboard.UI.addEventListener('shipDropped', (event) => {
  changeDraggableShipState(event.detail.shipID, false);
  if (planningGameboard.areAllShipsPlaced()) {
    planningConfirmBtn.classList.add('planning-btn-green');
    planningConfirmBtn.classList.remove('planning-btn-grey');
  }
});

shipRotateBtn.addEventListener('click', (event) => {
  console.log("changing rotation")
  planningGameboard.rotateShip();
});

shipResetBtn.addEventListener('click', (event) => {
  planningGameboard.resetShips();
  for (let i = 0; i < draggables.length; i++) {
    changeDraggableShipState(i, true);
  }
  planningConfirmBtn.classList.add('planning-btn-grey');
  planningConfirmBtn.classList.remove('planning-btn-green');
});

planningConfirmBtn.addEventListener('click', (event) => {
  if (!planningGameboard.areAllShipsPlaced()) return;
  planningWrapper.style.display = 'none';
  gameWrapper.style.display = 'inline-block';
});

