const helpButton = document.getElementById("helpButton");
const help = document.getElementById("help");

var helpShowing = false;
helpButton.onclick = () => {
    helpShowing = !helpShowing;
    if (helpShowing) {
        help.children[0].style.display = 'block';
    }
    else {
        help.children[0].style.display = 'none';
    }
}
