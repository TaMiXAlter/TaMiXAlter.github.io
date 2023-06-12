var cols, rows;
var w = 40;
var pressTimes = 0;
var grid = [];
var buttles = [];

var current;

var stack = [];

var startedPlaying = false;
var playPosition = false;
var endPosition = false;

var gameend = false;

function setup() {
    createCanvas(400, 400);
    cols = floor(width / w);
    rows = floor(height / w);

    for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
            var cell = new Cell(i, j);
            grid.push(cell);
        }

        current = grid[0];
    }


    while (!playPosition) {
        var startPoint = floor(random() * (grid.length * 0.1));
        playPosition = grid[startPoint];
    }

    while (!endPosition) {
        var ending = floor(random() * (grid.length - grid.length * 0.75) + (grid.length * 0.75));
        endPosition = grid[ending];
    }
}

class FallDown {
    constructor(gene, butI) {
        this.butHeight = w / 2;
        this.butWidth = w / 4;
        this.butY = -w;
        this.butI = butI;
        this.butJ = -1;

        this.genePoint = gene;
    }

    show() {
        fill(255, 0, 255);
        rect(this.genePoint + w / 2, + this.butY + w / 2, this.butWidth, this.butHeight, 0, 0, 5, 5);
    }
    update() {
        this.butY += w;
        this.butJ += 1;
    }

    whatIndex() {
        return index(this.butI, this.butJ);
    }
}

function draw() {
    if (gameend) {
        exit();
    }
    background(51);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    //frameRate(5)
    current.visited = true;
    if (!startedPlaying) {
        current.highlight();
    }

    var next = current.checkNeighbors();
    if (next) {
        next.visited = true;

        stack.push(current);

        removeWalls(current, next);

        current = next;
    }
    else if (stack.length > 0) {
        current = stack.pop();
    }
    else if (!startedPlaying) {
        startedPlaying = true;
        playPosition.playPosition = true;
        endPosition.endPosition = true;
    }

    for (let wholeBut = 0; wholeBut < buttles.length; wholeBut++) {
        buttles[wholeBut].show();
    }
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) return -1;

    return i + j * cols;
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function () {
        var neighbors = [];

        var top = grid[index(i, j - 1)];
        var bottom = grid[index(i, j + 1)];
        var right = grid[index(i + 1, j)];
        var left = grid[index(i - 1, j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            var r = floor(random(0, neighbors.length));
            return neighbors[r];
        }
        else {
            return undefined;
        }
    }

    this.highlight = function () {
        var x = this.i * w;
        var y = this.j * w;
        noStroke();
        fill(0, 0, 255, 100);
        rect(x, y, w, w);
    }

    this.show = function () {
        var x = this.i * w;
        var y = this.j * w;
        stroke(255);
        noFill();

        if (this.walls[0]) line(x, y, x + w, y);
        if (this.walls[1]) line(x + w, y, x + w, y + w);
        if (this.walls[2]) line(x + w, y + w, x, y + w);
        if (this.walls[3]) line(x, y + w, x, y);

        if (this.visited) {
            noStroke();
            fill(255, 0, 255, 100);
            rect(x, y, w, w);
        }

        if (this.playPosition) {
            fill(255, 0, 0);
            triangle(x + w / 2, y + w / 4, x + w / 4, y + w - w / 4, x + w - w / 4, y + w - w / 4);
        }

        if (this.endPosition) {
            fill(0, 255, 0)
            circle(x + w / 2, y + w / 2, w / 2, w / 2);
        }
    }
}

function removeWalls(a, b) {
    var x = a.i - b.i;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    }
    else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    var y = a.j - b.j;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    }
    else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function keyTyped() {
    if (gameend) {
        exit();
    }
    if (startedPlaying) {
        var moveTo;
        var valid = false;

        switch (key) {
            case 'W':
            case 'w':
                moveTo = grid[index(playPosition.i, playPosition.j - 1)];

                if (moveTo && !playPosition.walls[0] && !moveTo.walls[2]) {
                    pressTimes += 1;
                    valid = true;
                }

                break;

            case 'A':
            case 'a':
                moveTo = grid[index(playPosition.i - 1, playPosition.j)];

                if (moveTo && !playPosition.walls[3] && !moveTo.walls[1]) {
                    pressTimes += 1;
                    valid = true;
                }

                break;

            case 'S':
            case 's':
                moveTo = grid[index(playPosition.i, playPosition.j + 1)];

                if (moveTo && !playPosition.walls[2] && !moveTo.walls[0]) {
                    pressTimes += 1;
                    valid = true;
                }

                break;

            case 'D':
            case 'd':
                moveTo = grid[index(playPosition.i + 1, playPosition.j)];

                if (moveTo && !playPosition.walls[1] && !moveTo.walls[3]) {
                    pressTimes += 1;
                    valid = true;
                }

                break;
        }

        if (valid) {
            playPosition.playPosition = false;
            playPosition = moveTo;
            playPosition.playPosition = true;

            if (playPosition.j >= 2 && pressTimes >= 3) {
                var butI = floor(random(min(playPosition.i, endPosition.i), max(playPosition.i, endPosition.i)));
                var genePoint = butI * w;
                var buttle = new FallDown(genePoint, butI);
                buttles.push(buttle);
                pressTimes = 0;
            }

            if (buttles.length > 0) {
                for (let wholeBut = 0; wholeBut < buttles.length; wholeBut++) {
                    if (buttles[wholeBut].butY < height) {
                        buttles[wholeBut].update();
                        print(buttles[wholeBut].whatIndex() + "----" + index(playPosition.i, playPosition.j));
                        if (buttles[wholeBut].whatIndex() == index(playPosition.i, playPosition.j)) {
                            gameEnd("GameOver");
                            gameend = true;
                        }
                    }
                }
            }


            if (playPosition.endPosition) {
                gameEnd("You Win");
                gameend = true;
                window.removeEventListener('keydown', movement);
            }
        }
    }
}

function gameEnd(textgame) {
    background(150);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);

    text(textgame, width / 2, height / 2);
}