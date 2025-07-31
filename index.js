"use strict";
function printBoard(board) {
    for (const row of Object.values(board)) {
        console.log(Object.values(row)
            .map((cell) => (cell ? ' #️⃣ ' : ' _️⃣ '))
            .join(''));
    }
    console.log('');
}
function getNextTick(board, x, y) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const neighbors = [];
    const currentCell = (_a = board[x]) === null || _a === void 0 ? void 0 : _a[y];
    const indexX = parseInt(x);
    const indexY = parseInt(y);
    neighbors.push((_c = (_b = board[indexX]) === null || _b === void 0 ? void 0 : _b[indexY + 1]) !== null && _c !== void 0 ? _c : false);
    neighbors.push((_e = (_d = board[indexX]) === null || _d === void 0 ? void 0 : _d[indexY - 1]) !== null && _e !== void 0 ? _e : false);
    neighbors.push((_g = (_f = board[indexX + 1]) === null || _f === void 0 ? void 0 : _f[indexY]) !== null && _g !== void 0 ? _g : false);
    neighbors.push((_j = (_h = board[indexX + 1]) === null || _h === void 0 ? void 0 : _h[indexY - 1]) !== null && _j !== void 0 ? _j : false);
    neighbors.push((_l = (_k = board[indexX + 1]) === null || _k === void 0 ? void 0 : _k[indexY + 1]) !== null && _l !== void 0 ? _l : false);
    neighbors.push((_o = (_m = board[indexX - 1]) === null || _m === void 0 ? void 0 : _m[indexY]) !== null && _o !== void 0 ? _o : false);
    neighbors.push((_q = (_p = board[indexX - 1]) === null || _p === void 0 ? void 0 : _p[indexY - 1]) !== null && _q !== void 0 ? _q : false);
    neighbors.push((_s = (_r = board[indexX - 1]) === null || _r === void 0 ? void 0 : _r[indexY + 1]) !== null && _s !== void 0 ? _s : false);
    const aliveNeighbors = neighbors.filter(Boolean).length;
    if (currentCell) {
        return aliveNeighbors === 2 || aliveNeighbors === 3;
    }
    else {
        return aliveNeighbors === 3;
    }
}
function isBoardEmpty(board) {
    for (const row of Object.values(board)) {
        if (Object.values(row).some((cell) => cell === true)) {
            return false;
        }
    }
    return true;
}
function cloneBoard(board) {
    const copy = {};
    for (const x in board) {
        copy[x] = Object.assign({}, board[x]);
    }
    return copy;
}
// Expand the board by one cell in all directions to allow for new life to emerge
function expandBoard(board) {
    const newBoard = cloneBoard(board);
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
function shrinkBoard(board) {
    for (const row of Object.keys(board)) {
        if (Object.values(board[row]).every((cell) => !cell)) {
            delete board[row];
        }
    }
    const columnsToDelete = new Set();
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
function main(initBoard) {
    if (isBoardEmpty(initBoard)) {
        console.log('Board is empty, nothing to simulate.');
        return;
    }
    let board = cloneBoard(initBoard);
    let ticks = 0;
    while (true) {
        printBoard(board);
        if (isBoardEmpty(board)) {
            console.log('All cells are dead, simulation ends.');
            break;
        }
        //it also clonses the board
        const nextBoard = expandBoard(board);
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
        if (ticks >= 15) {
            console.log('Simulation reached 100 ticks, stopping.');
            break;
        }
    }
}
main({
    '0': { '0': false, '1': false, '2': false, '3': false, '4': false },
    '1': { '0': false, '1': true, '2': false, '3': false, '4': false },
    '2': { '0': false, '1': false, '2': true, '3': false, '4': false },
    '3': { '0': true, '1': true, '2': true, '3': false, '4': false },
    '4': { '0': false, '1': false, '2': false, '3': false, '4': false },
});
