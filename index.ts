type Board = { [key: string]: { [key: string]: boolean } };

function printBoard(board: Board): void {
    for (const row of Object.values(board)) {
        console.log(
            Object.values(row)
                .map((cell) => (cell ? ' #️⃣ ' : ' _️⃣ '))
                .join('')
        );
    }
    console.log('');
}

function getNextTick(board: Board, x: string, y: string): boolean {
    const neighbors: boolean[] = [];
    const currentCell = board[x]?.[y];
    const indexX = parseInt(x);
    const indexY = parseInt(y);
    neighbors.push(board[indexX]?.[indexY + 1] ?? false);
    neighbors.push(board[indexX]?.[indexY - 1] ?? false);
    neighbors.push(board[indexX + 1]?.[indexY] ?? false);
    neighbors.push(board[indexX + 1]?.[indexY - 1] ?? false);
    neighbors.push(board[indexX + 1]?.[indexY + 1] ?? false);
    neighbors.push(board[indexX - 1]?.[indexY] ?? false);
    neighbors.push(board[indexX - 1]?.[indexY - 1] ?? false);
    neighbors.push(board[indexX - 1]?.[indexY + 1] ?? false);

    const aliveNeighbors = neighbors.filter(Boolean).length;

    if (currentCell) {
        return aliveNeighbors === 2 || aliveNeighbors === 3;
    } else {
        return aliveNeighbors === 3;
    }
}

function isBoardEmpty(board: Board): boolean {
    for (const row of Object.values(board)) {
        if (Object.values(row).some((cell) => cell === true)) {
            return false;
        }
    }
    return true;
}

function cloneBoard(board: Board): Board {
    const copy: Board = {};
    for (const x in board) {
        copy[x] = { ...board[x] };
    }
    return copy;
}

// Expand the board by one cell in all directions to allow for new life to emerge
function expandBoard(board: Board): Board {
    const newBoard: Board = cloneBoard(board);
    const maxX = Math.max(...Object.keys(board).map(Number));
    const maxY = Math.max(...Object.keys(board[0] || {}).map(Number));

    for (let x = 0; x <= maxX + 1; x++) {
        newBoard[x] = newBoard[x] || {};
        for (let y = 0; y <= maxY + 1; y++) {
            newBoard[x][y] = newBoard[x][y] || false;
        }
    }

    return newBoard;
}
// Shirnk the board to remove empty rows and columns
function shrinkBoard(board: Board): Board {
    for (const row of Object.keys(board)) {
        if (Object.values(board[row]).every((cell) => !cell)) {
            delete board[row];
        }
    }
    const columnsToDelete: Set<string> = new Set();

    const numberOfColumns = Object.keys(board[0] || {}).length;

    for (let col = 0; col < numberOfColumns; col++) {
        const colKey = col.toString();
        if (Object.values(board).every((row) => !row[colKey])) {
            columnsToDelete.add(colKey);
        }
    }
    for (const row of Object.keys(board)) {
        for (const col of columnsToDelete) {
            delete board[row][col];
        }
    }
    return board;
}

function main(initBoard: Board) {
    if (isBoardEmpty(initBoard)) {
        console.log('Board is empty, nothing to simulate.');
        return;
    }

    let board: Board = cloneBoard(initBoard);
    let ticks = 0;

    while (true) {
        printBoard(board);

        if (isBoardEmpty(board)) {
            console.log('All cells are dead, simulation ends.');
            break;
        }
        //it also clonses the board
        const nextBoard: Board = expandBoard(board);

        for (const x of Object.keys(board)) {
            for (const y of Object.keys(board[x])) {
                const nextState = getNextTick(board, x, y);
                nextBoard[x][y] = nextState;
            }
        }

        // board = shrinkBoard(nextBoard);
        board = nextBoard;
        ticks++;
        console.log(`Tick: ${ticks}`);
    }
}

main({
    '0': { '0': false, '1': false, '2': false, '3': false, '4': false },
    '1': { '0': false, '1': true, '2': false, '3': false, '4': false },
    '2': { '0': false, '1': false, '2': true, '3': false, '4': false },
    '3': { '0': true, '1': true, '2': true, '3': false, '4': false },
    '4': { '0': false, '1': false, '2': false, '3': false, '4': false },
});
