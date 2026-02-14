import { getRows, getCols, getSquare, updateSquare } from "./board.js";
import { getSide } from "./drawView.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var prevCoords = null;

function drawCanvas() {
    const rows = getRows();
    const cols = getCols();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            paintSquare(i, j);
        }
    }
}

function paintSquare(i, j) {
    const side = (canvas.width) / getCols();
    ctx.fillStyle = getSquare(i, j).color;
    ctx.fillRect(j * side, i * side, side, side);
    return ctx.fillStyle;
}

canvas.onpointerdown = (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    var i = Math.floor((event.clientY - canvasRect.top) / getSide());
    var j = Math.floor((event.clientX - canvasRect.left) / getSide());
    if (event.buttons == 1) {
        prevCoords = { i, j };
    }
    else if (event.buttons == 2 && !getSquare(i, j).isEnd) {
        updateSquare(i, j, 0, false);
    }
}
canvas.onpointermove = (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    var i = Math.floor((event.clientY - canvasRect.top) / getSide());
    var j = Math.floor((event.clientX - canvasRect.left) / getSide());
    if (event.buttons == 1) {
        var curSquare = getSquare(i, j);
        if (prevCoords != null && (prevCoords.i != i || prevCoords.j != j)) {
            var prevSquare = getSquare(prevCoords.i, prevCoords.j);
            if (prevSquare.num != 0 && !curSquare.isEnd && curSquare.num != prevSquare.num) {
                updateSquare(i, j, prevSquare.num, false);
            }
            prevCoords = { i, j };
        }
    }
    else if (event.buttons == 2) {
        var curSquare = getSquare(i, j);
        if (curSquare.num != 0 && !curSquare.isEnd) {
            updateSquare(i, j, 0, false);
        }
    }
}
canvas.onpointerup = (event) => {
    prevCoords = null;
}
canvas.oncontextmenu = (event) => { event.preventDefault() };

export { drawCanvas, paintSquare };