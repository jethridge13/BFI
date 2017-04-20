//TODO: Function buttons
//TODO: Optional "Code by hand" method
//TODO: Add more to index.html

var app = angular.module('BFI', []);
var cells = 20;
var highlightedCell = "red";
var normalCell = "white";

var stepWait = 0;

var cursor = 0;

app.controller('TapeCtrl', ['$scope', function ($scope) {
        $scope.cells = new Array(cells).fill(0);
    }]);

function startButton() {
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