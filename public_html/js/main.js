//TODO: Function buttons
//TODO: Character parsing
//TODO: Optional "Code by hand" method
//TODO: Add more to index.html

var app = angular.module('BFI', []);
var cells = 20;
var highlightedCell = "#bfbfbf";
var normalCell = "white";

var stepWait = 0;
var running = false;
var paused = false;

var cursor = 0;

var panelVisible = false;
var inputVisible = true;

app.controller('TapeCtrl', ['$scope', function ($scope) {
        $scope.cells = new Array(cells).fill(0);
    }]);

function handleChar(c, line, char){
    
    switch(c){
        case "+":
            // +    Add one to the current cell
            var value = getValueFromCursor();
            value++;
            if(value > 255){
                value = 0;
            }
            updateValueAtCursor(value);
            break;
        case "-":
            // -    Subtract one to the current cell
            var value = getValueFromCursor();
            value--;
            if(value < 0){
                value = 255;
            }
            updateValueAtCursor(value);
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
            var value = getValueFromCursor();
            var characterToPrint = String.fromCharCode(value);
            $("#outputBody").append(characterToPrint);
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

function getValueFromCursor(){
    var refTab = document.getElementById("cellTable");
    var row = refTab.rows[0];
    var col = row.cells[cursor];
    var value = parseInt(col.innerHTML);
    return value;
}

function updateValueAtCursor(value){
    var refTab = document.getElementById("cellTable");
    var row = refTab.rows[0];
    var col = row.cells[cursor];
    col.innerHTML = value;
}

function startButton() {
    if (!running){
        $("#startButton").prop("disabled", true);
        $("#pauseButton").prop("disabled", false);
        $("#stopButton").prop("disabled", false);
        
        togglePanel();
        toggleInput();
        adjustPointer();
        var codeArray = initializeArray();
        handleCode(codeArray);
        
        running = true;
    }
}

function pauseButton() {
    //TODO
    if(running && !paused){
        $("#stepButton").prop("disabled", false);
        $("#pauseButton").prop("class", "btn btn-success");
        $("#pauseButton").html("Resume");
        
        paused = true;
        running = false;
    } else if (!running && paused) {
        $("#stepButton").prop("disabled", true);
        $("#pauseButton").prop("class", "btn btn-warning");
        $("#pauseButton").html("Pause");
        
        paused = false;
        running = true;
    }
}

function stepButton() {
    //TODO
}

function stopButton() {
    if(running || paused) {
        $("#startButton").prop("disabled", false);
        $("#pauseButton").prop("disabled", true);
        $("#pauseButton").prop("class", "btn btn-warning");
        $("#pauseButton").html("Pause");
        $("#stopButton").prop("disabled", true);
        
        togglePanel();
        toggleInput();
        
        cursor = 0;
        codeArray = [];
        
        running = false;
        paused = false;
    }
}

function adjustPointer() {
    if (cursor < 0 || cursor > cells - 1){
        throw{
            name:        "Memory Error",
            level:       "Bad",
            message:     "Cursor tried to access memory out of bounds.",
            htmlMessage: "Cursor tried to access memory out of bounds.",
            toString:    function(){return this.name + ": " + this.message;}
        };
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

function toggleInput(){
    if(!inputVisible){
        $("#code").show();
        inputVisible = true;
    } else {
        $("#code").hide();
        inputVisible = false;
    }
}

function togglePanel(){
    var rawCode = $("#code").val();
    rawCode = rawCode.replace(/\n/g, "<br>");
    $("#codeBody").html(rawCode);
    if(!panelVisible){
        $("#outputPanel").show();
        $("#codePanel").show();
        panelVisible = true;
    } else {
        $("#outputPanel").hide();
        $("#codePanel").hide();
        panelVisible = false;
    }
}

function initializeArray(){
    var rawCode = $("#code").val();
    var codeArray = [];
    codeArray.push([]);
    var line = 0;
    for(var i = 0; i < rawCode.length; i++){
        if(rawCode[i] === "\n"){
            codeArray.push([]);
            line++;
        } else {
            codeArray[line].push(rawCode[i]);
        }
    }
    return codeArray;
}

function handleCode(codeArray){
    //TODO
    
}

$(document).ready(function () {
    $("#startButton").bind("click", startButton);
    $("#pauseButton").bind("click", pauseButton);
    $("#stepButton").bind("click", stepButton);
    $("#stopButton").bind("click", stopButton);
});