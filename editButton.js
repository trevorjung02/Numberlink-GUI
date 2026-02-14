import { getEditMode, toggleInputEditingAll } from "./input.js";

const editButton = document.getElementById('editButton');

editButton.onclick = (event) => {
    toggleInputEditingAll();
    setButtonText();
}

function setButtonText() {
    if (getEditMode()) {
        editButton.textContent = 'Stop Editing';
    }
    else {
        editButton.textContent = 'Edit';
    }
}

setButtonText();
