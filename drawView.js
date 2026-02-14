import { getRows, getCols, loadBoard } from "./board.js";
import { drawCanvas } from "./canvas.js";
import { initInputs } from "./input.js";

const canvas = document.getElementById("canvas");
const gameArea = document.getElementById("gameArea");
const toolbar = document.getElementById("toolbar");

var side;

function drawView() {
    var maxWidth;
    var maxHeight;
    if (window.innerHeight > window.innerWidth) {
        toolbar.className = "bottombar";
    }
    else {
        toolbar.className = "sidebar";
    }
    const toolbarRect = toolbar.getBoundingClientRect();
    if (toolbar.className === "bottombar") {
        maxWidth = window.innerWidth * 0.9;
        maxHeight = window.innerHeight * 0.95 - toolbarRect.height;
        gameArea.style.marginTop = '5vh';
        gameArea.style.marginBottom = 0;
        toolbar.style.marginTop = 0;
    }
    else if (toolbar.className == "sidebar") {
        maxWidth = window.innerWidth - 2 * toolbarRect.width;
        maxHeight = window.innerHeight * 0.9;
        gameArea.style.marginTop = '5vh';
        gameArea.style.marginBottom = '5vh';
        toolbar.style.marginTop = '5vh';
    }
    maxHeight = Math.floor(maxHeight);
    maxWidth = Math.floor(maxWidth);
    gameArea.style.width = maxWidth + 'px';
    gameArea.style.height = maxHeight + 'px';
    gameArea.style.backgroundColor = 'black';

    var width;
    var height;
    var aspectRatio = getCols() / getRows();
    if (maxWidth / maxHeight <= aspectRatio) {
        width = maxWidth;
        height = maxWidth / aspectRatio;
    }
    else {
        height = maxHeight;
        width = maxHeight * aspectRatio;
    }
    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    side = width / getCols();

    drawCanvas();
    initInputs();
}

loadBoard();
window.onresize = () => drawView();

function getSide() {
    return side;
}

export { getSide, drawView };