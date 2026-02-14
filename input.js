import { getCols, getRows, updateSquare } from "./board.js";
import { getSide } from "./drawView.js";
import { getLightness } from "./utils.js";

const canvasDiv = document.getElementById('canvasDiv');

const inputs = [];
var inEditMode = false;

function initInputs() {
    const rows = getRows();
    const cols = getCols();
    const side = getSide();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (i * cols + j >= inputs.length) {
                createInput(i, j, side);
            }
            else {
                configureInput(i, j, side);
                enableInput(i * cols + j);
            }
        }
    }
    for (let i = rows * cols; i < inputs.length; i++) {
        disableInput(i);
    }
}

function configureInput(i, j, side) {
    var input = getInput(i, j);
    input.style.top = i * side + 'px';
    input.style.left = j * side + 'px';
    input.style.width = side + 'px';
    input.style.height = side + 'px';
    input.style.fontSize = side / 2 + 'px';
    input.oninput = () => inputUpdate(i, j, input.value);
    toggleInputEditing(i, j, inEditMode);
}

function inputUpdate(i, j, value) {
    const num = parseInt(value);
    updateSquare(i, j, num, !isEmptyInput(i, j));
}

function createInput(i, j, side) {
    const input = document.createElement('input');
    inputs.push(input);

    input.type = 'text';
    configureInput(i, j, side);

    input.onbeforeinput = (event) => {
        if ((event.data != null && Number.isNaN(parseInt(event.data))) || (event.data == '0' && input.value == '')) {
            event.preventDefault();
        }
    };

    canvasDiv.appendChild(input);

    return input;
}

function getInput(i, j) {
    return inputs[i * getCols() + j];
}

function setInputValue(i, j, value) {
    getInput(i, j).value = value;
}

function colorInput(i, j, rgb) {
    // Color Text
    const lightness = getLightness(rgb);
    if (lightness < 50) {
        getInput(i, j).style.color = 'white';
    }
    else {
        getInput(i, j).style.color = 'black';
    }
}

function isEmptyInput(i, j) {
    return getInput(i, j).value == '';
}

function enableInput(i) {
    inputs[i].disabled = false;
    inputs[i].style.zIndex = 'auto';
}

function disableInput(i) {
    inputs[i].disabled = true;
    inputs[i].value = '';
    inputs[i].style.zIndex = -1;
    inputs[i].style.top = 1 + 'px';
    inputs[i].style.left = 1 + 'px';
}

function toggleInputEditing(i, j) {
    getInput(i, j).style['pointer-events'] = inEditMode ? 'auto' : 'none';
}

function toggleInputEditingAll() {
    inEditMode = !inEditMode;
    for (let i = 0; i < getRows(); i++) {
        for (let j = 0; j < getCols(); j++) {
            toggleInputEditing(i, j);
        }
    }
}

function getEditMode() {
    return inEditMode;
}

export { initInputs, setInputValue, colorInput, toggleInputEditingAll, getEditMode };