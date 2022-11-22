// HTML Elements
board = document.getElementsByClassName('Board');
  
RNGInput = document.getElementById('RNG_Input');
sizeInput = document.getElementById('Size_Input');
trialInput = document.getElementById('Trial_Input');
colorInput = document.getElementById('Color_Input');
totalInput = document.getElementById('Total_Input');

InputTitles = document.getElementById('User_Input_Field')
  .getElementsByTagName('p');
  
Site = {
  total: 5,
  trials: 1,
  dimensions: 9,
  chance: 2,
  intensity: .05,
  color: '#FF0000',
  boardData: [[],[]],
  // Methods
}

/*/// Main ///*/

main();
async function main() {

  Site.total = await totalInput.value;
  Site.chance = await RNGInput.value;
  Site.dimensions = await sizeInput.value, 2;
  Site.trials = await trialInput.value;
  Site.intensity = (1 / Site.trials);
  Site.color = await colorInput.value;
  
  await initializeBoardData();
  await initializeBoardTiles();

  for (let trials = 1; trials < parseInt(Site.trials) + 1; trials++) {
    await linearRandomPlacement(Site.boardData[0], trials);
    await randomPlacement(Site.boardData[1], trials);
  }

  await applyHeat();
}

/*/// Definitions ///*/

function rand(min, max) { 
  return Math.round(Math.random() * (max - min) + min); 
}

async function initializeBoardData() { 
  Site.boardData = [[],[]];
  for (let index = 0; index < Math.pow(Site.dimensions, 2); index++) {
    Site.boardData[0].push(0);
    Site.boardData[1].push(0);
  }
}

async function initializeBoardTiles() {
  for (let boardNum = 0; boardNum < 2; boardNum++) {
    board[boardNum].innerHTML = '';
    for (let index = 0; index < Math.pow(Site.dimensions, 2); index++) {
      const newTile = document.createElement('div');
      newTile.classList.add('Tile');
      newTile.style.backgroundColor = 'white';
      board[boardNum].appendChild(newTile);
    }
  }
}

async function applyHeat() {
  let appliedColorFrag = 'RGBA(' +
    parseInt(Site.color.substr(1,2), 16) + ', ' +
    parseInt(Site.color.substr(3,4), 16) + ', ' +
    parseInt(Site.color.substr(5,6), 16) + ', '; 
  for (let boardNum = 0; boardNum < 2; boardNum++) {
    const boardTiles = board[boardNum].getElementsByClassName('Tile');
    for (let index = 0; index < Site.boardData[0].length; index++) {
      
      boardTiles[index].style.backgroundColor = 
        appliedColorFrag + (Site.intensity * Site.boardData[boardNum][index]) + ')';
      
    }
  }
}

async function linearRandomPlacement(boardData, trialCount) {
  let totalPlaced = 0;
  while (totalPlaced < Site.total) {
    
      for (let index = 0; index < boardData.length; index++) {
        if (rand(1, Site.chance) == 1 && boardData[index] < trialCount && totalPlaced < Site.total) {
          boardData[index] += 1;
          totalPlaced++;
        }
        if (totalPlaced >= Site.total) break;
      }
    
  }
}

async function randomPlacement(boardData, trialCount) {
  let totalPlaced = 0;
  while (totalPlaced < Site.total) {
    let randomTile = rand(0, boardData.length);
    if (rand(1, Site.chance) == 1 && boardData[randomTile] < trialCount && totalPlaced < Site.total) {
      boardData[randomTile] += 1;
      totalPlaced++;
    }
  }
}

/*/// Event Handlers ///*/

RNGInput.addEventListener('change', async function() {
  await main();
  InputTitles[0].innerHTML = 'Placement Chance: ' 
    + ((1 / RNGInput.value) * 100).toFixed(2) + ' %';
});

totalInput.addEventListener('change', async function() {
  await main();
  InputTitles[1].innerHTML = 'Total Placement: ' + totalInput.value;
});

sizeInput.addEventListener('change', async function() {
  main();
  InputTitles[2].innerHTML = 'Board Size: ' + sizeInput.value + 'x' + sizeInput.value;
  for (let boardNum = 0; boardNum < 2; boardNum++) {
    board[boardNum].style.height = 'calc(' + (sizeInput.value * 2) + 
      'vw + ' + (sizeInput.value * 2) + 'px)';
    board[boardNum].style.width = 'calc(' + (sizeInput.value * 2) + 
      'vw + ' + (sizeInput.value * 2) + 'px)';
  }
});

trialInput.addEventListener('change', function() {
  main();
  InputTitles[3].innerHTML = 'Trial Count: ' + trialInput.value;
});

colorInput.addEventListener('change', function() { main(); });