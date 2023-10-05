const Cell = require("cell.js");
const config = require("config.js");
const test = require("test.js")

function Stage(element) {
    this.element        = element;
    this.cellsArray     = [];
    this.bombsArray     = [];
    this.bombsCount     = 0;
    this.size           = 8;
    this.openedCells    = 0;
    this.totalCells     = this.size * this.size;
    this.end            = false;
    this.setSize(8);
}

Stage.prototype = {
    build(){
        this.buildTable();
    },
    buildTable(){
        this.element.width(this.width);
        this.element.height(this.height);
    },
    setSize(size){
        let width = 30 * size;
        let height = 30 * size;

        this.element.width(width);
        this.element.height(height);

        this.size = size;

        this.addCells(this.size, this.size);
        this.addBombs();
    },
    setCellSize(width, height){
        this.cell.width(width);
        this.cell.height(height);
    },
    addCells(x, y){
        for(let _y = 0; _y < y; _y++){
            let xArray = [];
            for(let _x = 0; _x < x; _x++){
                let cell = new Cell(_x, _y);
                xArray.push(cell);
                this.element.append(cell.element);
            }
            this.cellsArray.push(xArray);
        }
    },
    addBombs(){
        this.bombsCount = this.size;
        if(this.bombsCount){
            let count = 0;
            while(count < this.bombsCount){
                let randomX = this.randomizer(),
                    randomY = this.randomizer();
                let cell = this.cellsArray[randomY][randomX];
                if(!cell.bomb){
                    cell.bomb = true;
                    if(config.DEBUG) cell.hasBomb();
                    this.bombsArray.push(cell.name);

                    this.addCellCountGrid(randomX, randomY);

                    count++;
                }
            }
        }
    },
    addCellCountGrid(x, y){

        // left top
        this.addCellCount(x - 1, y - 1);

        //left
        this.addCellCount(x - 1, y);

        // left bottom
        this.addCellCount(x - 1, y + 1);

        // top
        this.addCellCount(x, y - 1);

        // bottom
        this.addCellCount(x, y + 1);

        // right top
        this.addCellCount(x + 1, y - 1);

        // right
        this.addCellCount(x + 1, y);

        // right bottom
        this.addCellCount(x + 1, y + 1);
    },
    addCellCount(x, y){
        if(this.cellsArray[y]){
            let cell = this.cellsArray[y][x];
            if(cell){
                cell.count++;
            }
        }
    },
    randomizer(){
        return Math.floor(Math.random() * this.cellsArray.length);
    },
    clickHandler(cell){
        let status = cell.click();
        if(!status){
            this.end = true;
            $("#stage").attr("status", "gameover");
            return;
        }

        this.checkWin();
        if(status === true){
            this.openSquare(cell.coordinates);
        }
    },
    openSquare(coordiantes){
        let x = coordiantes.x,
            y = coordiantes.y;

        if(!this.cellsArray[y] || !this.cellsArray[y][x]) return;

        // top
        let top = this.openSquareCheck({ x: x, y: y - 1})
        if(top === true){
            this.openSquare({x: x, y: y - 1});
        }
        // left
        let left = this.openSquareCheck({x: x - 1, y: y})
        if(left === true){
            this.openSquare({x: x - 1, y: y })
        }

        // bottom
        let bottom = this.openSquareCheck({ x: x, y: y + 1})
        if(bottom === true){
            this.openSquare({x: x, y: y + 1 })
        }

        // right
        let right = this.openSquareCheck({ x: x + 1, y: y})
        if(right === true){
            this.openSquare({x: x + 1, y: y })
        }

        //checking edges
        if(top > 0 && left > 0){
            let topLeft = this.openSquareCheck({x: x - 1, y: y - 1 })
            if(topLeft === true){
                this.openSquare({x: x - 1, y: y - 1 })
            }
        }

        if(top > 0 && right > 0){
            let topRight = this.openSquareCheck({x: x + 1, y: y - 1 })
            if(topRight === true){
                this.openSquare({x: x + 1, y: y - 1 })
            }
        }

        if(bottom > 0 && left > 0){
            let bottomLeft = this.openSquareCheck({x: x - 1, y: y + 1 })
            if(bottomLeft === true){
                this.openSquare({x: x - 1, y: y + 1 })
            }
        }

        if(bottom > 0 && right > 0){
            let bottomRight = this.openSquareCheck({x: x + 1, y: y + 1 })
            if(bottomRight === true){
                this.openSquare({x: x + 1, y: y + 1 })
            }
        }
    },
    openSquareCheck(coordiantes){
        let x = coordiantes.x,
            y = coordiantes.y;

        if(this.cellsArray[y]){
            let cell = this.cellsArray[y][x];
            if(cell){
                if(cell.open) return cell.count;

                if(!cell.open && !cell.bomb && !cell.flag){
                    this.checkWin();
                    return cell.click();
                }
            }
        }
        return false;
    },
    checkWin(){
        this.openedCells++;

        if(this.openedCells === (this.totalCells - this.bombsCount)){
            this.end = true;
            $("#stage").attr("status", "win");
        }
    }
};

window.Stage = Stage;

module.exports = Stage;