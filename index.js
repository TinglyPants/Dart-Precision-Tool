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

const GetScoreFromArgument = (argument) => {
    // Going anticlockwise from 0 to 60 degrees. This is all hard coded unfortunately.
    if (0 <= argument && argument < 9) {
        return 6;
    } else if (9 <= argument && argument < 27) {
        return 13;
    } else if (27 <= argument && argument < 45) {
        return 4;
    } else if (45 <= argument && argument < 63) {
        return 18;
    } else if (63 <= argument && argument < 81) {
        return 1;
    } else if (81 <= argument && argument < 99) {
        return 20;
    } else if (99 <= argument && argument < 117) {
        return 5;
    } else if (117 <= argument && argument < 135) {
        return 12;
    } else if (135 <= argument && argument < 153) {
        return 9;
    } else if (153 <= argument && argument < 171) {
        return 14;
    } else if (171 <= argument && argument < 189) {
        return 11;
    } else if (189 <= argument && argument < 207) {
        return 8;
    } else if (207 <= argument && argument < 225) {
        return 16;
    } else if (225 <= argument && argument < 243) {
        return 7;
    } else if (243 <= argument && argument < 261) {
        return 19;
    } else if (261 <= argument && argument < 279) {
        return 3;
    } else if (279 <= argument && argument < 297) {
        return 17;
    } else if (297 <= argument && argument < 315) {
        return 2;
    } else if (315 <= argument && argument < 333) {
        return 15;
    } else if (333 <= argument && argument < 351) {
        return 10;
    } else if (351 <= argument && argument <= 360) {
        return 6;
    }
};

const boardSize = 240; // This value must be even. This is to ensure good argument calculations, as I am lazy.
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

// Generating the board with correct points
for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
        let t = CartesianToPolar(x, y, boardCenterX, boardCenterY);

        let distance = t.modulus;
        let angle = t.argument;

        let value = GetScoreFromArgument(angle) * 4.25;

        if (distance < innerBullUpperBound) {
            //Point on inner bullseye
            board[x][y] = 50;
        } else if (distance < outerBullUpperBound) {
            //Point on outer bullseye
            board[x][y] = 25;
        } else if (trebleLowerBound < distance && distance < trebleUpperBound) {
            //Point on treble band
            board[x][y] = value * 3;
        } else if (doubleLowerBound < distance && distance < doubleUpperBound) {
            //Point on double band
            board[x][y] = value * 2;
        } else if (distance < doubleUpperBound) {
            // Point is on the board at least.
            board[x][y] = value;
        } else {
            // Point is not on the board
            board[x][y] = 0;
        }
    }
}

let precision = 100;
document.getElementById("precision").addEventListener("input", function () {
    precision = document.getElementById("precision").value;
    console.log("Input value changed to: " + precision);
});

const GetAverageAroundPoint = (x, y, precision) => {
    // Finds the average value around a point.

    let totalPointsScanned = 0;
    let total = 0;

    for (let localX = x - precision / 2; localX < x + precision / 2; localX++) {
        for (
            let localY = y - precision / 2;
            localY < y + precision / 2;
            localY++
        ) {
            // Make sure we are in bounds
            if (localX < 0 || localX > boardSize) {
                continue;
            }
            if (localY < 0 || localY > boardSize) {
                continue;
            }

            // Now we know the points are valid, we start adding.
            totalPointsScanned += 1;
            total += board[localX][localY];
        }
    }
    console.log("Completed point: " + x + "," + y);

    return total / totalPointsScanned;
};

const Render = () => {
    console.log("rendering");
    if (precision < 0 || precision > 500) {
        console.log("Invalid precision.");
        return;
    }
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            let t = GetAverageAroundPoint(x, y, precision);
            PlacePixel(ctx, x, y, t, t, t);
        }
    }
    console.log("Finished Rendering");
};
