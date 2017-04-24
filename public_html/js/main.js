//TODO: Function buttons
//TODO: Character parsing
//TODO: Optional "Code by hand" method
//TODO: Add more to index.html

var app = angular.module('BFI', []);
var cells = 20;
var highlightedCell = "red";
var normalCell = "white";

var stepWait = 0;

var cursor = 0;
var running = false;

app.controller('TapeCtrl', ['$scope', function ($scope) {
        $scope.cells = new Array(cells).fill(0);
    }]);

function handleChar(c, line, char){
    
    switch(c){
        case "+":
            // +    Add one to the current cell
            var refTab = document.getElementById("cellTable");
            var row = refTab.rows[0];
            var col = row.cells[cursor];
            var value = parseInt(col.innerHTML);
            value++;
            if(value > 255){
                value = 0;
            }
            col.innerHTML = value;
            break;
        case "-":
            // -    Subtract one to the current cell
            var refTab = document.getElementById("cellTable");
            var row = refTab.rows[0];
            var col = row.cells[cursor];
            var value = parseInt(col.innerHTML);
            value--;
            if(value < 0){
                value = 255;
            }
            col.innerHTML = value;
            break;
        case ">":
            // >    Increment cursor
            incrementCursor();
            break;
        case "<":
            // <    Decrement cursor
            decrementCursor();
            break;
        case ".":
            // .    Print char
            //TODO
            break;
        case ",":
            // ,    Accept char
            //TODO
            break;
        case "[":
            // [    Start of loop
            //TODO
            break;
        case "]":
            // ]    End of loop
            //TODO
            break;
    }
}

function startButton() {
    if (!running){
        $("#startButton").prop("disabled", true);
        
        $("#pauseButton").prop("disabled", false);
        $("#stopButton").prop("disabled", false);
    }
}

function pauseButton() {
    
}

function stepButton() {
    
}

function stopButton() {

}

function adjustPointer() {
    if (cursor < 0 || cursor > cells - 1){
        throw{
            name:        "Memory Error",
            level:       "Bad",
            message:     "Cursor tried to access memory out of bounds.",
            htmlMessage: "Cursor tried to access memory out of bounds.",
            toString:    function(){return this.name + ": " + this.message;}
        }
    }
    var refTab = document.getElementById("cellTable");
    // Loop through all rows and columns of the table and popup alert with the value
    // /content of each cell.
    for (var i = 0; row = refTab.rows[i]; i++) {
        row = refTab.rows[i];
        for (var j = 0; col = row.cells[j]; j++) {
            if(j === cursor){
                col.style = "background-color: " + highlightedCell;
            } else {
                col.style = "background-color: " + normalCell;
            }
        }
    }
}

function incrementPointer() {
    cursor++;
    adjustPointer();
}

function decrementPointer() {
    cursor--;
    adjustPointer();
}

$(document).ready(function () {
    $("#startButton").bind("click", startButton);
    $("#pauseButton").bind("click", pauseButton);
    $("#stepButton").bind("click", stepButton);
    $("#stopButton").bind("click", stopButton);
});