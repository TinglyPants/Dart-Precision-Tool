const canvas = document.getElementById("display");
let ctx = canvas.getContext("2d");

const CreateEmptyBoardArray = (size) => {
    // Array that is [size] by [size], filled with 0's.
    return Array(size)
        .fill(0)
        .map((x) => Array(size).fill(0));
};

const CartesianToPolar = (x, y, centerX, centerY) => {
    // Modulus Calculations (in pixels)
    distanceX = Math.abs(centerX - x);
    distanceY = Math.abs(centerY - y);
    totalDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    // Argument Calculations
    let temp;
    // Quadrant 1:
    if (x > centerX && y < centerY) {
        temp = (Math.atan(distanceY / distanceX) * 180) / Math.PI;
    }
    // Quadrant 2:
    else if (x < centerX && y < centerY) {
        temp = 180 - (Math.atan(distanceY / distanceX) * 180) / Math.PI;
    }
    // Quadrant 3
    else if (x < centerX && y > centerY) {
        temp = 180 + (Math.atan(distanceY / distanceX) * 180) / Math.PI;
    }
    // Quadrant 4
    else if (x > centerX && y > centerY) {
        temp = 360 - (Math.atan(distanceY / distanceX) * 180) / Math.PI;
    }
    // Modulus is in pixels. Argument is measured in degrees (because radians are boring) Furthermore, Argument is measured from 0 < t < 360, as opposed to -180 < t < 180. This makes later calculations easier.
    return { modulus: totalDistance, argument: temp };
};

const PlacePixel = (context, x, y, red, green, blue) => {
    // Set the fill color
    context.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
    // Draw the pixel
    context.fillRect(x, y, 1, 1);
};

const boardSize = 500; // This value must be even. This is to ensure good argument calculations, as I am lazy.
const boardCenterX = boardSize / 2 - 0.5; // Adjusted for 0 indexing.
const boardCenterY = boardSize / 2 - 0.5; // Adjusted for 0 indexing.

let board = CreateEmptyBoardArray(boardSize);

// Defining radial distance bounds, relative to the board size, in pixels.
const innerBullUpperBound = (6.35 / 170) * (boardSize / 2);
const outerBullUpperBound = (16 / 170) * (boardSize / 2);
const trebleLowerBound = (99 / 170) * (boardSize / 2);
const trebleUpperBound = (107 / 170) * (boardSize / 2);
const doubleLowerBound = (162 / 170) * (boardSize / 2);
const doubleUpperBound = (170 / 170) * (boardSize / 2);

for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
        let t = CartesianToPolar(x, y, boardCenterX, boardCenterY);

        let distance = t.modulus;
        let angle = t.argument;

        if (distance < innerBullUpperBound) {
            //Point on inner bullseye
            PlacePixel(ctx, x, y, 255, 0, 0);
        } else if (distance < outerBullUpperBound) {
            //Point on outer bullseye
            PlacePixel(ctx, x, y, 0, 255, 0);
        } else if (trebleLowerBound < distance && distance < trebleUpperBound) {
            //Point on treble band
            PlacePixel(ctx, x, y, 128, 128, 0);
        } else if (doubleLowerBound < distance && distance < doubleUpperBound) {
            //Point on double band
            PlacePixel(ctx, x, y, 0, 128, 128);
        } else if (distance < doubleUpperBound) {
            // Point is on the board at least.
            PlacePixel(ctx, x, y, angle * 0.70833333333, 0, 0);
        }
    }
}
