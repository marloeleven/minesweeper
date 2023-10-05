var test = require("test.js")

function Cell(x, y){
    this.element = $("<div class=\"cell\"></div>");
    this.coordinates = { x: x, y: y };
    this.bomb = false;
    this.flag = false;
    this.open = false;
    this.count = 0;
    this.name = x+","+y;
    this.element.attr("title", x+":"+y);
    this.element.data("object", this);
}

Cell.prototype = {
    click: function(click){
        this.open = true;
        this.element.addClass("open");
        if(this.bomb){
            this.element.html("&ofcir;");
            this.element.addClass("bomb");
            return false;
        }
        this.element.empty();
        if(this.count){
            this.element.text(this.count);
            this.element.addClass("count-"+this.count)
            return this.count;
        }
        return true;
    },
    putFlag: function(){
        this.flag = !this.flag;
        this.element.toggleClass("flag");
    },
    hasBomb: function(){
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