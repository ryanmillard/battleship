

function createGameboardUI() {
  let gameboardFrame = document.createElement('div');
  gameboardFrame.classList.add('gameboard');

  const width = 10;
  const height = 10;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let cell = document.createElement('div');
      cell.classList.add('gameboard-cell');
      gameboardFrame.appendChild(cell);
    }
  }

  return gameboardFrame
}

module.exports = { createGameboardUI };