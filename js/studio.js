const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var painting = new Array(625);

var paintingWidth = 25;
var scale = canvas.width / paintingWidth;

var mouseDown = false;
var mouseOnScreen = false;
var mousePos = {
    x: 0,
    y: 0
};

const paletts = [
    ["fefefe", "#8f8b8d", "#000000", "#5a3529", "#ed224d", "#b61f23", "#e85e1f", "#ffd70e", "#1f5729", "#0046c9", "#0cb6c7", "#6a417c"]
];

var currentPalette = undefined;
var currentColor = "white";


loadPalette(paletts[0]);
clearPainting();

function loadPalette(palette) {

    currentPalette = palette;

    // Apply # for all hex values missing it.
    for (let i = 0; i < currentPalette.length; i++) {
        if (currentPalette[i][0] != "#") currentPalette[i] = "#" + currentPalette[i];
    }

    /* // Sort palette
    currentPalette = sortPalette(currentPalette); */

    var paletteProgress = 0;
    var paletteElements = document.getElementsByClassName("color-option");

    var paletteAnimationLoading = setInterval(() => {
        if (paletteProgress >= currentPalette.length) clearInterval(paletteAnimationLoading);
        else {
            paletteElements[paletteProgress].id = currentPalette[paletteProgress];
            paletteElements[paletteProgress].style.background = currentPalette[paletteProgress];
        }
        paletteProgress++;
    }, 50);

    chooseColor(currentPalette[0]);
}


canvas.addEventListener("mousemove", e => {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = Math.round(e.clientX - rect.left);
    mousePos.y = Math.round(e.clientY - rect.top);
    mouseOnScreen = true;
    if (mouseDown) paint();
    else renderCanvas();
})

canvas.oncontextmenu = function () {
    fill();
    return false; // Prevent context menu from showing
}

canvas.addEventListener("click", e => {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = Math.round(e.clientX - rect.left);
    mousePos.y = Math.round(e.clientY - rect.top);
    paint();
})

canvas.addEventListener("mousedown", e => {
    mouseDown = true;
    mouseOnScreen = true;
    renderCanvas();
})
canvas.addEventListener("mouseup", e => {
    mouseDown = false;
    mouseOnScreen = true;
    renderCanvas();
})
canvas.addEventListener("mouseout", e => {
    mouseDown = false;
    mouseOnScreen = false;
    renderCanvas();
})

function renderCanvas() {

    // Render painting
    for (let i = 0; i < painting.length; i++) {
        var coordinates = indexToCoordinates(i);
        if (painting[i] != null) {
            ctx.fillStyle = painting[i];
        } else {
            ctx.fillStyle = "#111";
        }
        ctx.fillRect(coordinates.x * scale, coordinates.y * scale, scale, scale);
    }

    // Render cursor
    if (mouseOnScreen) {
        var rgbValue = hexSorter.hexToRgb(currentColor);
        ctx.fillStyle = "rgba(" + rgbValue[0] + ", " + rgbValue[1] + ", " + rgbValue[2] + ", 0.5)";
        ctx.fillRect(Math.floor(mousePos.x / scale) * scale, Math.floor(mousePos.y / scale) * scale, scale, scale);
    }
}

renderCanvas();

function paint() {

    if (Math.floor(mousePos.x / scale) > paintingWidth || Math.floor(mousePos.y / scale) > paintingWidth) return;

    // Figure out where to paint in the array
    var index = coordinatesToIndex(Math.floor(mousePos.x / scale), Math.floor(mousePos.y / scale));
    // Apply paint in the array
    painting[index] = currentColor;
    // Update canvas
    renderCanvas();
}

/**
 * Fill function
 * Colors the neightbouring area of the same color.
 * Right-click action.
 */
function fill() {
    // Get origin variables
    var origin = {
        x: Math.floor(mousePos.x / scale),
        y: Math.floor(mousePos.y / scale)
    };
    var replaceColor = currentColor; // Color to replace all connecting origin colors with
    var originColor = painting[coordinatesToIndex(origin.x, origin.y)] // Origin color clicked on

    // Don't fill if the two colors are the same, no reason to do so. Possibly a missclick from the user that would create an endless loop.
    if (originColor == replaceColor) return;
    // Set the origin block to the replacement color.
    painting[coordinatesToIndex(origin.x, origin.y)] = replaceColor;

    // Create a worker array with all blocks who could possibly neighbour a replacement block.
    var workers = new Array();
    // Push the initial origin block to check all neighbours.
    workers.push({
        x: origin.x,
        y: origin.y
    }); // Push the first block

    // Loop through until the fill action is completed, aka all the workers are done.
    while (workers.length > 0) {

        // Check the first worker in line
        checkWorker(workers[0]);

        function checkWorker(worker) {
            var items = [];
            // Check all neighbouring blocks to the item (worker).
            items.push({
                x: worker.x + 1,
                y: worker.y
            }); // Left 
            items.push({
                x: worker.x - 1,
                y: worker.y
            }); // Right
            items.push({
                x: worker.x,
                y: worker.y + 1
            }); // Bottom
            items.push({
                x: worker.x,
                y: worker.y - 1
            }); // Top
            items.forEach(item => {
                // Go through each item and check if it has the matching origin color, if that's the case - change it's color and put it into the worker array to check all it's neightbouring blocks. 
                if (item.x <= paintingWidth && item.y <= paintingWidth) {

                    var color = painting[coordinatesToIndex(item.x, item.y)]
                    if (color == originColor) {
                        painting[coordinatesToIndex(item.x, item.y)] = replaceColor; // Replaced a block
                        workers.push(item); // Push that block to see if it has any neighbours for replacement.
                    }
                }
            })
            workers.splice(0, 1); // Remove the first worker.
        }
    }
}


function clearPainting() {
    var randomColor = currentPalette[Math.floor(Math.random()*currentPalette.length-1)];
    for (let i = 0; i < painting.length; i++) {
        painting[i] = "#111";
    }
}


function coordinatesToIndex(x, y) {
    return x + (paintingWidth * y);
}

function indexToCoordinates(index) {
    let x = index % paintingWidth;
    let y = (index - x) / paintingWidth;
    return {
        x: x,
        y: y
    };
}

function chooseColor(color) {
    // Apply color change
    currentColor = color;
    // Update canvas
    renderCanvas();
}