/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Command = __webpack_require__(1);
	var Stage = __webpack_require__(2);
	var test = __webpack_require__(4);

	var stage = new Stage($("div#stage"));
	stage.build();

	$(document).keyup(function (event) {
	    switch (event.which) {
	        case 37:
	            //left
	            Command.trigger("moveX", "minus");
	            break;
	        case 38:
	            //top
	            Command.trigger("moveY", "minus");
	            break;
	        case 39:
	            //right
	            Command.trigger("moveX");
	            break;
	        case 40:
	            //down
	            Command.trigger("moveY");
	            break;
	    }
	});

	var $cell = $("div.cell");

	$cell.on("click contextmenu", function (event) {
	    if (stage.end) return;

	    var cell = $(this).data("object");
	    if (event.which === 1 && !cell.flag && !cell.open) {
	        stage.clickHandler(cell);
	    }

	    if (event.which === 3 && !cell.open) {
	        event.preventDefault();
	        cell.putFlag();
	    }
	});

	$(document).on("onselectstart", function () {
	    return false;
	});
	$(document).on("contextmenu", function () {
	    return false;
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var Command = function Command() {
	    this.bindings = {};
	};

	Command.prototype = {
	    bind: function bind(_event, _function) {
	        if (this.bindings._event !== undefined) {
	            return;
	        }

	        this.bindings[_event] = _function;
	    },
	    trigger: function trigger(_event, _parameter) {
	        if (!$.inArray(_event, this.bindings)) {
	            return true;
	        }

	        this.bindings[_event](_parameter);
	    }
	};

	window.Command = new Command();

	module.exports = Command;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Cell = __webpack_require__(3);
	var config = __webpack_require__(5);
	var test = __webpack_require__(4);

	function Stage(element) {
	    this.element = element;
	    this.cellsArray = [];
	    this.bombsArray = [];
	    this.bombsCount = 0;
	    this.size = 8;
	    this.openedCells = 0;
	    this.totalCells = this.size * this.size;
	    this.end = false;
	    this.setSize(8);
	}

	Stage.prototype = {
	    build: function build() {
	        this.buildTable();
	    },
	    buildTable: function buildTable() {
	        this.element.width(this.width);
	        this.element.height(this.height);
	    },
	    setSize: function setSize(size) {
	        var width = 30 * size;
	        var height = 30 * size;

	        this.element.width(width);
	        this.element.height(height);

	        this.size = size;

	        this.addCells(this.size, this.size);
	        this.addBombs();
	    },
	    setCellSize: function setCellSize(width, height) {
	        this.cell.width(width);
	        this.cell.height(height);
	    },
	    addCells: function addCells(x, y) {
	        for (var _y = 0; _y < y; _y++) {
	            var xArray = [];
	            for (var _x = 0; _x < x; _x++) {
	                var cell = new Cell(_x, _y);
	                xArray.push(cell);
	                this.element.append(cell.element);
	            }
	            this.cellsArray.push(xArray);
	        }
	    },
	    addBombs: function addBombs() {
	        this.bombsCount = this.size;
	        if (this.bombsCount) {
	            var count = 0;
	            while (count < this.bombsCount) {
	                var randomX = this.randomizer(),
	                    randomY = this.randomizer();
	                var cell = this.cellsArray[randomY][randomX];
	                if (!cell.bomb) {
	                    cell.bomb = true;
	                    if (config.DEBUG) cell.hasBomb();
	                    this.bombsArray.push(cell.name);

	                    this.addCellCountGrid(randomX, randomY);

	                    count++;
	                }
	            }
	        }
	    },
	    addCellCountGrid: function addCellCountGrid(x, y) {

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
	    addCellCount: function addCellCount(x, y) {
	        if (this.cellsArray[y]) {
	            var cell = this.cellsArray[y][x];
	            if (cell) {
	                cell.count++;
	            }
	        }
	    },
	    randomizer: function randomizer() {
	        return Math.floor(Math.random() * this.cellsArray.length);
	    },
	    clickHandler: function clickHandler(cell) {
	        var status = cell.click();
	        if (!status) {
	            this.end = true;
	            $("#stage").attr("status", "gameover");
	            return;
	        }

	        this.checkWin();
	        if (status === true) {
	            this.openSquare(cell.coordinates);
	        }
	    },
	    openSquare: function openSquare(coordiantes) {
	        var x = coordiantes.x,
	            y = coordiantes.y;

	        if (!this.cellsArray[y] || !this.cellsArray[y][x]) return;

	        // top
	        var top = this.openSquareCheck({ x: x, y: y - 1 });
	        if (top === true) {
	            this.openSquare({ x: x, y: y - 1 });
	        }
	        // left
	        var left = this.openSquareCheck({ x: x - 1, y: y });
	        if (left === true) {
	            this.openSquare({ x: x - 1, y: y });
	        }

	        // bottom
	        var bottom = this.openSquareCheck({ x: x, y: y + 1 });
	        if (bottom === true) {
	            this.openSquare({ x: x, y: y + 1 });
	        }

	        // right
	        var right = this.openSquareCheck({ x: x + 1, y: y });
	        if (right === true) {
	            this.openSquare({ x: x + 1, y: y });
	        }

	        //checking edges
	        if (top > 0 && left > 0) {
	            var topLeft = this.openSquareCheck({ x: x - 1, y: y - 1 });
	            if (topLeft === true) {
	                this.openSquare({ x: x - 1, y: y - 1 });
	            }
	        }

	        if (top > 0 && right > 0) {
	            var topRight = this.openSquareCheck({ x: x + 1, y: y - 1 });
	            if (topRight === true) {
	                this.openSquare({ x: x + 1, y: y - 1 });
	            }
	        }

	        if (bottom > 0 && left > 0) {
	            var bottomLeft = this.openSquareCheck({ x: x - 1, y: y + 1 });
	            if (bottomLeft === true) {
	                this.openSquare({ x: x - 1, y: y + 1 });
	            }
	        }

	        if (bottom > 0 && right > 0) {
	            var bottomRight = this.openSquareCheck({ x: x + 1, y: y + 1 });
	            if (bottomRight === true) {
	                this.openSquare({ x: x + 1, y: y + 1 });
	            }
	        }
	    },
	    openSquareCheck: function openSquareCheck(coordiantes) {
	        var x = coordiantes.x,
	            y = coordiantes.y;

	        if (this.cellsArray[y]) {
	            var cell = this.cellsArray[y][x];
	            if (cell) {
	                if (cell.open) return cell.count;

	                if (!cell.open && !cell.bomb && !cell.flag) {
	                    this.checkWin();
	                    return cell.click();
	                }
	            }
	        }
	        return false;
	    },
	    checkWin: function checkWin() {
	        this.openedCells++;

	        if (this.openedCells === this.totalCells - this.bombsCount) {
	            this.end = true;
	            $("#stage").attr("status", "win");
	        }
	    }
	};

	window.Stage = Stage;

	module.exports = Stage;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var test = __webpack_require__(4);

	function Cell(x, y) {
	    this.element = $("<div class=\"cell\"></div>");
	    this.coordinates = { x: x, y: y };
	    this.bomb = false;
	    this.flag = false;
	    this.open = false;
	    this.count = 0;
	    this.name = x + "," + y;
	    this.element.attr("title", x + ":" + y);
	    this.element.data("object", this);
	}

	Cell.prototype = {
	    click: function click(_click) {
	        this.open = true;
	        this.element.addClass("open");
	        if (this.bomb) {
	            this.element.html("&ofcir;");
	            this.element.addClass("bomb");
	            return false;
	        }
	        this.element.empty();
	        if (this.count) {
	            this.element.text(this.count);
	            this.element.addClass("count-" + this.count);
	            return this.count;
	        }
	        return true;
	    },
	    putFlag: function putFlag() {
	        this.flag = !this.flag;
	        this.element.toggleClass("flag");
	    },
	    hasBomb: function hasBomb() {
	        this.element.addClass("hasBomb");
	    }
	};

	window.Cell = Cell;

	module.exports = Cell;

	/*
	    .__.__.__.__.__.__.
	    |__|__|__|__|__|__|
	    |__|__|__|_o|__|__|
	    |__|__|_o|__|_x|__|
	    |__|__|__|__|__|__|
	    |__|__|__|__|__|__|
	    |__|__|__|__|__|__|
	    |__|__|__|__|__|__|
	    |__|__|__|__|__|__|

	*/

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function test(item) {
	    console.log(item);
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    DEBUG: false
	};

/***/ }
/******/ ]);