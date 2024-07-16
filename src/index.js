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

const delay = ms => new Promise(res => setTimeout(res, ms));

const main = document.getElementsByTagName('main')[0];
const planningWrapper = document.getElementsByClassName('planning-wrapper')[0];
const planningGrid = document.getElementsByClassName('planning-grid')[0];

const planningGameboard = Gameboard(planningGrid, shipImages, true);

const shipRotateBtn = document.getElementById('ship-rotate-btn');
const shipRandomBtn = document.getElementById('ship-random-btn');
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

const gameMessage = document.getElementsByClassName('game-message')[0];

for (let i = 0; i < draggables.length; i++) {
  draggables[i].addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('draggingShipID', i);
  });
}

let hasGameStarted = false;
let hasGameEnded = false;

function changeDraggableShipState(shipID, enabled) {
  let item = draggables[shipID]
  item.draggable = enabled;
  item.style.cursor = enabled ? 'grab' : 'not-allowed';
  for (let i = 0; i < item.children.length; i++) {
    item.children[i].style.visibility = enabled ? 'visible' : 'hidden';
  }
}

function setGameMessage(text) {
  gameMessage.textContent = text;
}

function changeConfirmBtnState(enabled) {
  planningConfirmBtn.classList.add(`planning-btn-${enabled ? 'green':'grey'}`);
  planningConfirmBtn.classList.remove(`planning-btn-${enabled ? 'grey':'green'}`);
}

planningGameboard.UI.addEventListener('shipDropped', (event) => {
  changeDraggableShipState(event.detail.shipID, false);
  if (planningGameboard.areAllShipsPlaced()) changeConfirmBtnState(true);
});

shipRotateBtn.addEventListener('click', (event) => {
  planningGameboard.rotateShip();
});

shipRandomBtn.addEventListener('click', (event) => {
  planningGameboard.randomlyPlaceAllShips();
  for (let i = 0; i < draggables.length; i++) {
    changeDraggableShipState(i, false);
  }
  changeConfirmBtnState(true);
});

shipResetBtn.addEventListener('click', (event) => {
  planningGameboard.resetShips();
  for (let i = 0; i < draggables.length; i++) {
    changeDraggableShipState(i, true);
  }
  changeConfirmBtnState(false);
});

planningConfirmBtn.addEventListener('click', (event) => {
  if (!planningGameboard.areAllShipsPlaced()) return;
  planningWrapper.style.display = 'none';
  gameWrapper.style.display = 'inline-block';

  let ships = planningGameboard.getShips();
  for (let shipID = 0; shipID < ships.length; shipID++) {
    gameboardOne.createShip(
      shipID,
      ships[shipID].coordinates[0],
      ships[shipID].isHorizontal
    );
  }

  gameboardTwo.randomlyPlaceAllShips(true);

  hasGameStarted = true;
});

let fireAtShipDebounce = false;

gameboardTwo.UI.addEventListener('cellClicked', async (event) => {
  if (!hasGameStarted) return;
  if (hasGameEnded) return;
  
  let cell = [event.detail.x, event.detail.y];
  if (!gameboardTwo.isFireLocationValid(cell[0], cell[1])) return;
  
  if (fireAtShipDebounce) return;
  fireAtShipDebounce = true

  gameboardTwo.fireAtLocation(cell[0], cell[1]);

  const hasPlayerOneWonGame = gameboardTwo.areAllShipsSunk();
  if (hasPlayerOneWonGame) {
    hasGameEnded = true;
    setGameMessage('YOU WIN! All Enemy ships destroyed.');
    return;
  }
  
  // Can Player One take another turn
  if (gameboardTwo.isAShipOnCord(cell[0], cell[1])) {
    fireAtShipDebounce = false;
    setGameMessage('Hit! You get another turn.');
    return;
  } else {
    setGameMessage('You missed! Enemies turn!');
  }

  let computersTurn = true;
  while (computersTurn) {
    await delay(1500); // Simulating computer taking time to process
    let randLocation = gameboardOne.getRandomUnfiredLocation();
    gameboardOne.fireAtLocation(randLocation[0], randLocation[1]);
    const hasPlayerTwoWonGame = gameboardOne.areAllShipsSunk();
    if (hasPlayerTwoWonGame) {
      hasGameEnded = true;
      setGameMessage("You lost! All friendly ships have sunk...");
      return;
    }
    if (!gameboardOne.isAShipOnCord(randLocation[0], randLocation[1])) {
      computersTurn = false;
      setGameMessage('Enemy miss! Our turn.');
    } else {
      setGameMessage('Enemy has hit our ship!');
    }
  }
  fireAtShipDebounce = false;
});
