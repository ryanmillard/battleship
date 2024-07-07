import './sass/style.scss';
import './classes/gameboard.js';
import './classes/ship.js';
import './ui.js';
import './shipData.js'

import carrierSVG from './assets/images/carrier.svg';
import battleshipSVG from './assets/images/battleship.svg';
import cruiserSVG from './assets/images/cruiser.svg';
import submarineSVG from './assets/images/submarine.svg';
import destroyerSVG from './assets/images/destroyer.svg';

const shipImages = [carrierSVG, battleshipSVG, cruiserSVG, submarineSVG, destroyerSVG];

const Gameboard = require('./classes/gameboard.js');
const UI = require('./ui.js');

const main = document.getElementsByTagName('main')[0];
const planningGrid = document.getElementsByClassName('planning-grid')[0];

const shipData = require('./shipData.js');

let shipSelectionBoard = {
  'data': Gameboard(),
  'ui': UI.createGameboardUI(true)
}

planningGrid.prepend(shipSelectionBoard.ui);

const shipRotateBtn = document.getElementById('ship-rotate-btn');
const shipResetBtn = document.getElementById('ship-reset-btn');
const planningConfirmBtn = document.getElementById('planning-confirm-btn');

const planningGameboard = shipSelectionBoard.ui.children[0];
const draggablesContainer = document.getElementsByClassName('draggables-container')[0];
const draggables = draggablesContainer.children;

const shipContainer = shipSelectionBoard.ui.children[1];

for (let i = 0; i < draggables.length; i++) {
  draggables[i].addEventListener('dragstart', (event) => {
    draggingShipID = i;
  });
}

let isHorizontal = true;
let draggingShipID = null;

function isValidGameboardCord(x,y) {
  return x >= 0 && x <= 9 && y >= 0 && y <= 9;
}

function getCellNumberFromCord(x,y) {
  console.log(x,y,(y*9)+x);
  return (y * 10) + x;
}

function resetGridHighlights() {
  let cells = shipSelectionBoard.ui.children[0].children;
  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    cell.classList.remove('cell-accept', 'cell-deny');
  }
}

function isShipDropLocationValid(start, isHorizontal, length) {
  for (let i = 1; i < length; i++) {
    let cord = [
      isHorizontal ? start[0] + i : start[0],
      isHorizontal ? start[1] : start[1] + i
    ];

    if (!isValidGameboardCord(cord[0], cord[1])) return false;
  }

  return true;
}

function highlightShipDropLocation(start, isHorizontal, length) {
  let shipCords = [start];
  let validPlacement = true;
  for (let i = 1; i < length; i++) {
    let cord = [
      isHorizontal ? start[0] + i : start[0],
      isHorizontal ? start[1] : start[1] + i
    ];

    if (!isValidGameboardCord(cord[0], cord[1])) {
      validPlacement = false;
      break;
    }
    
    shipCords.push(cord);
  }

  for (let i = 0; i < shipCords.length; i++) {
    let cord = shipCords[i];
    let cellNum = getCellNumberFromCord(cord[0], cord[1]);
    let cell = planningGameboard.children[cellNum];

    cell.classList.add(validPlacement ? 'cell-accept' : 'cell-deny');
  }
}

function createShipUI(shipID, start, isHorizontal) {
  let ship = shipData[shipID];

  let placedShipContainer = document.createElement('div');
  placedShipContainer.classList.add('placed-ship-container');

  // Set container size to length of ship
  placedShipContainer.style.width = `${ship.length * 10}%`; // X
  placedShipContainer.style.height = '10%' // Y
  
  // Set container position in gameboard to where it was dropped
  placedShipContainer.style.left = `${start[0] * 10}%`; // X
  placedShipContainer.style.top = `${start[1] * 10}%`; // Y

  // Rotate ship if not horizontal
  if (!isHorizontal) {
    // Needs to be translated or it goes out of place
    placedShipContainer.style.transform = "rotate(90deg) translate(0px, -100%)";
    placedShipContainer.style.transformOrigin = "left top 0px";
  }

  let placedShipImg = document.createElement('img');
  placedShipImg.classList.add('placed-ship-img');
  placedShipImg.src = shipImages[shipID];
  placedShipContainer.appendChild(placedShipImg);

  shipContainer.appendChild(placedShipContainer);
}

planningGameboard.addEventListener('dragleave', (event) => {
  event.stopPropagation();
  event.preventDefault();
  if (draggingShipID === null) return;
  if (event.currentTarget.contains(event.relatedTarget)) return;
  resetGridHighlights();
  console.log("Drag leave grid");
});

shipSelectionBoard.ui.addEventListener('shipDropped', (event) => {
  resetGridHighlights();
  let shipLength = shipData[draggingShipID].length;
  let dropLocation = [event.detail.x, event.detail.y];

  if (isShipDropLocationValid(
    dropLocation,
    isHorizontal,
    shipLength)
  ) {
    draggingShipID = null;
    return;
  }
  
  createShipUI(draggingShipID, dropLocation, isHorizontal);
  draggingShipID = null;
});

shipSelectionBoard.ui.addEventListener('cellDragEnter', (event) => {
  if (draggingShipID === null) return;
  let shipLength = shipData[draggingShipID].length;
  resetGridHighlights();
  highlightShipDropLocation([event.detail.x, event.detail.y], isHorizontal, shipLength);
});

shipSelectionBoard.ui.addEventListener('cellClicked', (event) => {
  console.log('Cell clicked', event.detail);
});

shipRotateBtn.addEventListener('click', (event) => {
  console.log("changing rotation")
  isHorizontal = isHorizontal ? false : true;
});

shipResetBtn.addEventListener('click', (event) => {

});

planningConfirmBtn.addEventListener('click', (event) => {

});

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