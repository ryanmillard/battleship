import './sass/style.scss';
import './classes/gameboard.js';
import './classes/ship.js';
import './ui.js';
import './shipData.js'

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

const planningGameboard = shipSelectionBoard.ui.children[0];

let draggablesContainer = document.getElementsByClassName('draggables-container')[0];
let draggables = draggablesContainer.children;

for (let i = 0; i < draggables.length; i++) {
  console.log(draggables[i]);
  console.log(shipData[i]);

  draggables[i].addEventListener('dragstart', (event) => {
    draggingShipID = i;
  });
}

let isHorizontal = false;
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
    let cell = shipSelectionBoard.ui.children[0].children[cellNum];

    cell.classList.add(validPlacement ? 'cell-accept' : 'cell-deny');
  }
}

planningGameboard.addEventListener('dragleave', (event) => {
  event.stopPropagation();
  event.preventDefault();
  if (event.currentTarget.contains(event.relatedTarget)) return;
  resetGridHighlights();
  console.log("Drag leave grid");
});

shipSelectionBoard.ui.addEventListener('shipDropped', (event) => {
  resetGridHighlights();
  let shipLength = shipData[draggingShipID].length;
  if (isShipDropLocationValid([event.detail.x, event.detail.y], isHorizontal, shipLength)) return;
});

shipSelectionBoard.ui.addEventListener('cellDragLeave', (event) => {
  console.log('Cell Leave', event.detail);
});

shipSelectionBoard.ui.addEventListener('cellDragEnter', (event) => {
  console.log('Cell Enter', event.detail);
  let shipLength = shipData[draggingShipID].length;
  resetGridHighlights();
  highlightShipDropLocation([event.detail.x, event.detail.y], isHorizontal, shipLength);
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