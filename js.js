const fifteen = document.querySelector('.fifteen');
const countItems = 16;


const createButton = (innerText, parent, index) => {
    const button = document.createElement('button');
    button.classList.add('item');
    button.setAttribute('data-matrix-id', index);
    button.innerHTML = `<span class="itemVal">${innerText}</span>`;
    parent.appendChild(button);
}

const drawItems = (count) => {
    for (let i = 1 ; i <= count ; i++) {
        createButton(i, fifteen, i);
    }
}

drawItems(countItems);
const itemNode = fifteen.querySelectorAll('.item');
const fifteenItems = Array.from(itemNode);

/** 1. Position */

fifteenItems[countItems - 1].style.display = 'none';
let matrix = getMatrix(
    fifteenItems.map(item => Number(item.dataset.matrixId))
);
setItemPosition(matrix);

/** 2. Shuffle */

document.querySelector('.button').addEventListener('click', () => {
    const shuffledArray = shuffleArray(matrix.flat());
    matrix = getMatrix(shuffledArray);
    setItemPosition(matrix);
});

/** 3. Change position by click */

const blankNumber = 16;
fifteen.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) {
        return
    }

    const buttonNumber = Number(button.dataset.matrixId);
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const isValid = isValidForSwap(buttonCoords, blankCoords);

    if(isValid) {
        swap(blankCoords, buttonCoords, matrix);
        setItemPosition(matrix);
    }

});

/** 4. Change position by keydown */

    window.addEventListener('keydown', event => {
        if (!event.key.includes('Arrow')) {
            return
        }

        const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
        const buttonCoords = {
            x: blankCoords.x,
            y: blankCoords.y,
        };
        const direction = event.key.split('Arrow')[1].toLocaleLowerCase();

        switch(direction) {
            case 'up':
                buttonCoords.y += 1;
                break;
            case 'right':
                buttonCoords.x -= 1;
                break;
            case 'down':
                buttonCoords.y -= 1;
                break;
            case 'left':
                buttonCoords.x += 1;
                break;
        }

        if(buttonCoords.y >= matrix.length || buttonCoords.y < 0 ||
           buttonCoords.x >= matrix.length || buttonCoords.x < 0
        ) {
            return;
        }

        swap(blankCoords, buttonCoords, matrix);
        setItemPosition(matrix);
    });

/** 5. Show won */

/**
 * Helpers
 */

function getMatrix(arr) {
    const matrix = [ [], [], [], [] ];
    let x = 0, y = 0;

    for (let i = 0; i < arr.length; i++) {
        if (x >= 4) {
            y++;
            x = 0;
        }
        matrix[y][x] = arr[i];
        x++;
    }
    
    return matrix;
}

function setItemPosition(matrix) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            const value = matrix[y][x];
            const node = fifteenItems[value - 1];
            setNodeStyles(node, x, y)
        }
    }
}

function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3d(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}

function shuffleArray(arr) {
    return arr
    .map(value => ({value, sort: Math.random()}))
    .sort((a,b) => a.sort - b.sort)
    .map(({value}) => value);
}

function findCoordinatesByNumber(number, matrix) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] === number) {
                return {x, y};
            }
        }
    }
    return null;
}

function isValidForSwap(coords1, coords2) {
    const diffX = Math.abs(coords1.x - coords2.x);
    const diffY = Math.abs(coords1.y - coords2.y);

    return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y)
}

function swap(coords1, coords2, matrix) {
    const coordsNumber = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
    matrix[coords2.y][coords2.x] = coordsNumber;

    if (isWon(matrix)) {
        addWonClass();
    }
}

const winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1);
function isWon(matrix) {
    const flatMatrix = matrix.flat();
    for(let i = 0; i < winFlatArr.length; i++) {
        if (flatMatrix[i] !== winFlatArr[i]) {
            return false;
        }
    }
    return true;
}

const wonClass = 'fifteenWon';
function addWonClass() {
    setTimeout(() => {
        fifteen.classList.add(wonClass);
        setTimeout(() => {
            fifteen.classList.remove(wonClass);
        }, 1000)
    }, 200);
}

