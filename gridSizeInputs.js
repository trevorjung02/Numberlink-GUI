import { initBoard, getRows, getCols, clearBoard } from "./board.js";
import { drawView } from "./drawView.js";

const rowInput = document.getElementById("rowInput");
const colInput = document.getElementById("colInput");
rowInput.value = getRows();
colInput.value = getCols();
var prevRowValue = rowInput.value;
var prevColValue = colInput.value;
const min = 1;
const max = 15;

rowInput.oninput = (event) => {
    if (parseRows() > max || parseRows() < min) {
        rowInput.value = prevRowValue;
    }
    else {
        clearBoard();
        initBoard(parseRows(), parseCols());
        drawView();
    }
    prevRowValue = rowInput.value;
};

colInput.oninput = (event) => {
    if (parseCols() > max || parseCols() < min) {
        colInput.value = prevColValue;
    }
    else {
        clearBoard();
        initBoard(parseRows(), parseCols());
        drawView();
    }
    prevColValue = colInput.value;
};

rowInput.onbeforeinput = (event) => preventBefore(event, rowInput);
colInput.onbeforeinput = (event) => preventBefore(event, colInput);

function preventBefore(event, input) {
    if (event.data == null) {
        if (input.value.length == 1) {
            event.preventDefault();
        }
    }
    else {
        const val = parseInt(event.data);
        if (Number.isNaN(val)) {
            event.preventDefault();
        }
    }
};

function parseRows() {
    return parseInt(rowInput.value);
}

function parseCols() {
    return parseInt(colInput.value);
}

function setRowInput() {
    rowInput.value = getRows();
    prevRowValue = rowInput.value;
}

function setColInput() {
    colInput.value = getCols();
    prevColValue = colInput.value;
}

export { setRowInput, setColInput };
