const canvas = document.getElementById("display");
let ctx = canvas.getContext("2d");

const boardSize = 10;

const CreateEmptyBoardArray = (size) => {
    // Array that is [size] by [size], filled with 0's.
    return Array(size)
        .fill(0)
        .map((x) => Array(size).fill(0));
};

let board = CreateEmptyBoardArray(boardSize);

console.log(board);
