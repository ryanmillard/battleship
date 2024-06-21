

function createGameboardUI(isFriendly) {
  let containerFrame = document.createElement('div');
  containerFrame.classList.add('gameboard-container');

  let gameboardFrame = document.createElement('div');
  gameboardFrame.classList.add('gameboard');
  containerFrame.appendChild(gameboardFrame);

  gameboardFrame.classList.add(isFriendly ? 'friendly-board':'enemy-board');

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

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let cell = document.createElement('div');
      cell.classList.add('gameboard-cell');
      gameboardFrame.appendChild(cell);

      cell.addEventListener('click', () => {
        containerFrame.dispatchEvent(new CustomEvent('cellClicked', {
          detail: { 'x': x, 'y': y }
        }));
      });
    }
  }

  return containerFrame;
}

module.exports = { createGameboardUI };