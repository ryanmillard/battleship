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
const planningGrid = document.getElementsByClassName('planning-grid')[0];

const planningGameboard = Gameboard(planningGrid, shipImages, true);

const shipRotateBtn = document.getElementById('ship-rotate-btn');
const shipResetBtn = document.getElementById('ship-reset-btn');
const planningConfirmBtn = document.getElementById('planning-confirm-btn');

const draggablesContainer = document.getElementsByClassName('draggables-container')[0];
const draggables = draggablesContainer.children;

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
});

planningConfirmBtn.addEventListener('click', (event) => {

});
