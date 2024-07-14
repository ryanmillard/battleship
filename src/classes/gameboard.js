const { Ship, shipData } = require('./ship.js');

function Gameboard(parent, shipImages, isFriendly) {
  console.log(parent);
  let isHorizontal = true;
  let gameboard = [];
  let ships = [];
  let firedLocations = [];
  resetShipsStored();
  for (let x = 0; x < 10; x++) {
    gameboard[x] = [];
    for (let y = 0; y < 10; y++) {
      gameboard[x][y] = null;
    }
  }

  let gameboardWrapper = document.createElement('div');
  gameboardWrapper.classList.add('gameboard-wrapper');
  
  let containerFrame = document.createElement('div');
  containerFrame.classList.add('gameboard-container');
  gameboardWrapper.appendChild(containerFrame);

  let gameboardFrame = document.createElement('div');
  gameboardFrame.classList.add('gameboard');
  containerFrame.appendChild(gameboardFrame);

  gameboardFrame.classList.add(isFriendly ? 'friendly-board':'enemy-board');

  let shipContainerFrame = document.createElement('div');
  shipContainerFrame.classList.add('ship-container');
  containerFrame.appendChild(shipContainerFrame);

  let gameboardNumbers = document.createElement('div');
  gameboardNumbers.classList.add('gameboard-numbers');
  containerFrame.appendChild(gameboardNumbers);

  let gameboardLetters = document.createElement('div');
  gameboardLetters.classList.add('gameboard-letters');
  containerFrame.appendChild(gameboardLetters)

  const letters = ['A','B','C','D','E','F','G','H','I','J'];

  for (let i = 0; i < 10; i++) {
    let num = document.createElement('div');
    num.classList.add('side-char');
    num.textContent = i+1;
    gameboardNumbers.appendChild(num);

    let letter = document.createElement('div');
    letter.classList.add('side-char');
    letter.textContent = letters[i];
    gameboardLetters.appendChild(letter);
  }

  const width = 10;
  const height = 10;

  function createHitCircle(parent, hasHitShip) {
    let circle = document.createElement('div')
    circle.classList.add('cell-circle');
    const animClass = `circle-ship-${hasHitShip ? 'hit' : 'miss'}`;
    circle.classList.add(animClass);
    parent.appendChild(circle);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let cell = document.createElement('div');
      cell.classList.add('gameboard-cell');
      gameboardFrame.appendChild(cell);

      // Cell was clicked
      cell.addEventListener('click', () => {
        containerFrame.dispatchEvent(new CustomEvent('cellClicked', {
          detail: { 'x': x, 'y': y }
        }));
      });
    
      // The cell has had a draggable element dropped on it.
      cell.addEventListener('drop', (event) => {
        event.preventDefault();
        resetGridHighlights();

        const draggingShipID = event.dataTransfer.getData('draggingShipID');

        if (ships[draggingShipID].isPlaced) return;

        let shipLength = shipData[draggingShipID].length;
        let dropLocation = [x,y];
      
        if (!isShipDropLocationValid(
          dropLocation,
          isHorizontal,
          shipLength)
        ) {
          return;
        }
      
        createShip(draggingShipID, dropLocation, isHorizontal);
        
        containerFrame.dispatchEvent(new CustomEvent('shipDropped', {
          detail: { 'shipID': draggingShipID }
        }));
      });

      // The cell has had the mouse enter it with an element being dragged
      cell.addEventListener('dragenter', (event) => {
        event.preventDefault();
        const draggingShipID = event.dataTransfer.getData('draggingShipID');
        let shipLength = shipData[draggingShipID].length;
        resetGridHighlights();
        highlightShipDropLocation([x,y], isHorizontal, shipLength);
      });

      // Prevents unwanted behaviour
      cell.addEventListener('dragover', (event) => event.preventDefault());
    }
  }

  parent.appendChild(gameboardWrapper);

  function isValidGameboardCord(x,y) {
    return x >= 0 && x <= 9 && y >= 0 && y <= 9;
  }

  function getCellNumberFromCord(x,y) {
    return (y * 10) + x;
  }

  function getShipOnCord(x,y) {
    for (let i = 0; i < ships.length; i++) {
      let shipCords = ships[i].coordinates;
      for (let j = 0; j < shipCords.length; j++) {
        let currentCord = shipCords[j];
        if (currentCord[0] === x && currentCord[1] === y) {
          return i;
        }
      }
    }
    return null;
  }

  function calculateDropLocationCords(start, isHorizontal, length) {
    let cords = [];
    for (let i = 0; i < length; i++) {
      cords.push([
        isHorizontal ? start[0] + i : start[0],
        isHorizontal ? start[1] : start[1] + i
      ]);      // let circle = createHitCircle();
      // cell.appendChild(circle);
    }
    return cords;
  }

  function isShipDropLocationValid(start, isHorizontal, length) {
    for (let i = 0; i < length; i++) {
      let cord = [
        isHorizontal ? start[0] + i : start[0],
        isHorizontal ? start[1] : start[1] + i
      ];
  
      if (!isValidGameboardCord(cord[0], cord[1])) return false;
      if (getShipOnCord(cord[0], cord[1]) !== null) return false;
    }
  
    return true;
  }

  function highlightShipDropLocation(start, isHorizontal, length) {
    let shipCords = [];
    let validPlacement = true;
    for (let i = 0; i < length; i++) {
      let cord = [
        isHorizontal ? start[0] + i : start[0],
        isHorizontal ? start[1] : start[1] + i
      ];
  
      if (!isValidGameboardCord(cord[0], cord[1])) {
        validPlacement = false;
        break;
      }

      if (getShipOnCord(cord[0], cord[1]) !== null) {
        validPlacement = false;
      }
      
      shipCords.push(cord);
    }
  
    for (let i = 0; i < shipCords.length; i++) {
      let cord = shipCords[i];
      let cellNum = getCellNumberFromCord(cord[0], cord[1]);
      let cell = gameboardFrame.children[cellNum];
  
      cell.classList.add(validPlacement ? 'cell-accept' : 'cell-deny');
    }
  }

  function createShipData(shipID, dropLocation, isHorizontal, isHidden=false) {
    const shipLength = shipData[shipID].length;
    ships[shipID].isPlaced = true;
    ships[shipID].isHorizontal = isHorizontal;
    ships[shipID].isVisible = !isHidden;
    ships[shipID].setLength(shipLength);
    ships[shipID].coordinates = calculateDropLocationCords(
      dropLocation,
      isHorizontal,
      shipLength
    );
  }

  function createShip(shipID, dropLocation, isHorizontal, isHidden=false) {
    createShipData(shipID, dropLocation, isHorizontal, isHidden);
    if (!isHidden) createShipUI(shipID, dropLocation, isHorizontal);
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

    shipContainerFrame.appendChild(placedShipContainer);
  }

  function resetGridHighlights() {
    let cells = gameboardFrame.children;
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      cell.classList.remove('cell-accept', 'cell-deny');
    }
  }

  function resetShipsStored() {
    for (let i = 0; i < 5; i++) {
      ships[i] = Ship();
    }
  }

  function resetShips() {
    while (shipContainerFrame.firstChild) {
      shipContainerFrame.removeChild(shipContainerFrame.lastChild);
    }
    resetShipsStored();
  }

  function areAllShipsPlaced() {
    for (let i = 0; i < ships.length; i++) {
      if (!ships[i].isPlaced) return false;
    }
    return true;
  }

  function randomlyPlaceAllShips(isHidden=false) {
    const randomCord = () => Math.floor(Math.random()*10);

    resetShips();
    
    for (let shipID = 0; shipID < shipData.length; shipID++) {
      let shipLength = shipData[shipID].length;
      let shipPlaced = false;

      while (!shipPlaced) {
        let isHorizontal = Math.random() < 0.5;
        let x = randomCord();
        let y = randomCord();
        let dropLocation = [x,y];

        if (!isShipDropLocationValid(dropLocation, isHorizontal, shipLength)) continue;
        
        createShipData(shipID, dropLocation, isHorizontal, isHidden);
        if (!isHidden) createShipUI(shipID, dropLocation, isHorizontal);

        shipPlaced = true;
      }
    }
  }

  function addGameboardTitle(text) {
    let gameboardTitle = document.createElement('div');
    gameboardTitle.classList.add('gameboard-title');
    gameboardTitle.classList.add(`${isFriendly ? 'friendly' : 'enemy'}-title`);
    gameboardTitle.textContent = text;
    gameboardWrapper.prepend(gameboardTitle);
  }

  function isFireLocationValid(x,y) {
    if (!isValidGameboardCord(x,y)) return false;
    if (firedLocations.includes(`${x}${y}`)) return false;
    return true;
  }

  function fireAtLocation(x,y) {
    if (!isFireLocationValid(x,y)) return;
    firedLocations.push(`${x}${y}`);
    let cellNum = getCellNumberFromCord(x,y);
    let cell = gameboardFrame.children[cellNum];

    const hitShipID = getShipOnCord(x,y);
    const hasHitShip = hitShipID !== null;
    createHitCircle(cell, hasHitShip);

    if (hasHitShip) {
      ships[hitShipID].hit();
      console.log(ships[hitShipID].isSunk());
      console.log(ships[hitShipID].getTimesHit());
      if (ships[hitShipID].isSunk()) {
        createShipUI(
          hitShipID,
          ships[hitShipID].coordinates[0],
          ships[hitShipID].isHorizontal
        )
      }
    }
  }

  gameboardFrame.addEventListener('dragleave', (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget)) return;
    resetGridHighlights();
  });

  const rotateShip = () => isHorizontal = !isHorizontal;
  const getShips = () => ships;

  return {
    isValidGameboardCord,
    getCellNumberFromCord,
    isShipDropLocationValid,
    highlightShipDropLocation,
    resetGridHighlights,
    rotateShip,
    resetShips,
    getShips,
    areAllShipsPlaced,
    addGameboardTitle,
    randomlyPlaceAllShips,
    createShip,
    isFireLocationValid,
    fireAtLocation,
    'UI': containerFrame
  }
}

module.exports = Gameboard;