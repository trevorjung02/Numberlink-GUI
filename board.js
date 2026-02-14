import ModulePromise from './FlowFree/flowfree.js';
import { colorList } from "./utils.js";
import { drawCanvas, paintSquare } from "./canvas.js";
import { setInputValue, colorInput, initInputs } from "./input.js";
import { setColInput, setRowInput } from './gridSizeInputs.js';
import { drawView } from './drawView.js';
const FlowFree = await ModulePromise();

var rows;
var cols;
var squares;

// initBoard(3, 3);

function getRows() {
    return rows;
}

function getCols() {
    return cols;
}

async function loadBoard() {
    try {
        const response = await fetch("./FlowFree/puzzles/inputg.txt");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const text = await response.text();
        const arr = text.match(/\S+/g).map((s) => parseInt(s));
        initBoard(arr[0], arr[1]);
        drawView();
        setRowInput();
        setColInput();
        for (let i = 2; i < arr.length; i++) {
            updateSquare(Math.floor((i - 2) / cols), (i - 2) % cols, Math.abs(arr[i]), arr[i] < 0);
        }
    }
    catch (error) {
        console.error(error.message);
    }
}

function initBoard(rowIn, colIn) {
    rows = rowIn;
    cols = colIn;
    squares = [];
    for (let i = 0; i < rows * cols; i++) {
        squares.push({
            num: 0,
            color: 'black',
            isEnd: false
        })
    }
}

function getSquare(i, j) {
    return squares[i * cols + j];
}

function updateSquare(i, j, num, isEnd) {
    if (!Number.isNaN(num)) {
        getSquare(i, j).num = num;
    }
    else {
        getSquare(i, j).num = 0;
    }
    getSquare(i, j).color = colorList[getSquare(i, j).num % colorList.length];
    getSquare(i, j).isEnd = isEnd;

    // Paint Canvas
    const rgb = paintSquare(i, j, getSquare(i, j).color);

    // Set text
    if (isEnd) {
        setInputValue(i, j, getSquare(i, j).num);
    }
    else {
        setInputValue(i, j, '');
    }

    // Color text
    colorInput(i, j, rgb);
}

function solve() {
    const vec = new FlowFree.IntVector();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            var num = getSquare(i, j).num;
            if (getSquare(i, j).isEnd) {
                num = -num;
            }
            vec.push_back(num);
        }
    }
    const solVec = FlowFree.solve(rows, cols, vec);
    var res;
    if (solVec.size() > 0) {
        for (let i = 0; i < rows; i++) {
            var s = "";
            for (let j = 0; j < cols; j++) {
                var value = solVec.get(i * cols + j);
                updateSquare(i, j, Math.abs(value), value < 0);
                s += solVec.get(i * cols + j) + " ";
            }
            // console.log(s);
        }
        res = true;
    }
    else {
        // console.log("Not Solvable");
        res = false;
    }
    vec.delete();
    solVec.delete();
    return res;
}

function clearBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            updateSquare(i, j, 0, false);
        }
    }
}

function restartBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!getSquare(i, j).isEnd) {
                updateSquare(i, j, 0, false);
            }
        }
    }
}


export { getRows, getCols, getSquare, updateSquare, solve, clearBoard, initBoard, loadBoard, restartBoard };
