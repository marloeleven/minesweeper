const Command = require("command.js");
const Stage = require("stage.js");
const test = require("test.js");

const stage = new Stage($("div#stage"));
stage.build();

$(document).keyup(function(event){
    switch(event.which){
        case 37: //left
            Command.trigger("moveX", "minus");
            break;
        case 38: //top
            Command.trigger("moveY", "minus");
            break;
        case 39: //right
            Command.trigger("moveX");
            break;
        case 40: //down
            Command.trigger("moveY");
            break;
    }
});

const $cell = $("div.cell");

$cell.on("click contextmenu", function(event){
    if(stage.end) return;

    let cell = $(this).data("object");
    if(event.which === 1 && !cell.flag && !cell.open){
        stage.clickHandler(cell);
    }

    if(event.which === 3 && !cell.open){
        event.preventDefault();
        cell.putFlag();
    }
});

$(document).on("onselectstart", () => false );
$(document).on("contextmenu", () => false );