import { solve } from "./board.js";

const solveButton = document.getElementById('solveButton');
solveButton.onclick = (event) => {
    if (solve()) {
        solveButton.style.backgroundColor = 'green';
    }
    else {
        solveButton.style.backgroundColor = '#880808';
    }
    setTimeout(() => solveButton.style.backgroundColor = '', 1000);
}