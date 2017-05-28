//TODO: Optional "Code by hand" method
//TODO: Add a dropdown to allow for code examples

var app = angular.module('BFI', []);
var cells = 20;
var highlightedCell = "#bfbfbf";
var normalCell = "white";

// How many milliseconds to wait in between steps
var stepWait = 0;
// The last used indices when pausing the run
var lastX = -1;
var lastY = -1;
var lastArray = [];
// Running state
var runningStates = {
    STOPPED: -1,
    PAUSED: 0,
    RUNNING: 1,
    STEP: 2,
    WAITINGFORINPUT: 3,
};
var state = runningStates.STOPPED;
var lastState = runningStates.STOPPED;

var cursor = 0;
var loopStack = [];

var panelVisible = false;
var inputVisible = true;

app.controller('TapeCtrl', ['$scope', function ($scope) {
        $scope.cells = new Array(cells).fill(0);
    }]);

function handleChar(c, line, char) {
    tup = [line, char];
    switch (c) {
        case "+":
            // +    Add one to the current cell
            var value = getValueFromCursor();
            value++;
            if (value > 255) {
                value = 0;
            }
            updateValueAtCursor(value);
            break;
        case "-":
            // -    Subtract one to the current cell
            var value = getValueFromCursor();
            value--;
            if (value < 0) {
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
            acceptInput();
            break;
        case "[":
            // [    Start of loop
            loopStack.push(tup);
            console.log("Stack push: " + tup);
            console.log(loopStack);
            break;
        case "]":
            // ]    End of loop
            var counter = getValueFromCursor();
            if (counter !== 0) {
                tup = loopStack[loopStack.length-1];
                console.log("Stack pop: " + tup);
                console.log(loopStack);
                tup[1]--;
            } else {
                loopStack.pop();
            }
            break;
    }

    return tup;
}

function getValueFromCursor() {
    var refTab = document.getElementById("cellTable");
    var row = refTab.rows[0];
    var col = row.cells[cursor];
    var value = parseInt(col.innerHTML);
    return value;
}

function updateValueAtCursor(value) {
    var refTab = document.getElementById("cellTable");
    var row = refTab.rows[0];
    var col = row.cells[cursor];
    col.innerHTML = value;
}

function acceptInput() {
    lastState = state;
    state = runningStates.WAITINGFORINPUT;
    $("#inputForm").show();
    $("#input").prop("disabled", false);
}

function startButton() {
    if (state !== runningStates.RUNNING) {
        $("#startButton").prop("disabled", true);
        $("#pauseButton").prop("disabled", false);
        $("#stopButton").prop("disabled", false);

        clearOutput();
        togglePanel();
        toggleInput();
        adjustCursor();
        var codeArray = initializeArray();
        handleCode(codeArray, 0, 0);

        state = runningStates.RUNNING;
    }
}

function pauseButton() {
    if (state === runningStates.RUNNING) {
        $("#stepButton").prop("disabled", false);
        $("#pauseButton").prop("class", "btn btn-success");
        $("#pauseButton").html("Resume");

        state = runningStates.PAUSED;
    } else if (state === runningStates.PAUSED || state === runningStates.STEP) {
        $("#stepButton").prop("disabled", true);
        $("#pauseButton").prop("class", "btn btn-warning");
        $("#pauseButton").html("Pause");

        state = runningStates.RUNNING;
        
        handleCode(lastArray, lastX, lastY);
    } 
}

function stepButton() {
    if(state === runningStates.STOPPED){
        $("#pauseButton").prop("disabled", false);
        $("#startButton").prop("disabled", true);
        $("#pauseButton").prop("class", "btn btn-success");
        $("#pauseButton").html("Resume");
        $("#stopButton").prop("disabled", false);
        
        togglePanel();
        toggleInput();
        adjustCursor();
        lastArray = initializeArray();
        
        lastX = 0;
        lastY = 0;
    } 
    state = runningStates.STEP;
    handleCode(lastArray, lastX, lastY); 
}

function stopButton() {
    if (state === runningStates.RUNNING || state === runningStates.PAUSED || 
            state === runningStates.STEP) {
        $("#startButton").prop("disabled", false);
        $("#pauseButton").prop("disabled", true);
        $("#pauseButton").prop("class", "btn btn-warning");
        $("#pauseButton").html("Pause");
        $("#stopButton").prop("disabled", true);
        $("#inputForm").hide();
        $("#input").prop("disabled", true);

        togglePanel();
        toggleInput();

        cursor = 0;
        codeArray = [];
        zeroArray();

        state = runningStates.STOPPED;
    }
}

function submitButton() {
    if (state === runningStates.WAITINGFORINPUT) {
        var value = $("#input").val();
        value = value.charCodeAt(0);
        if (value < 0 || value > 255) {
            throw{
                name: "Invalid Input Error",
                level: "Bad",
                message: "User entered a character out of acceptable range.",
                htmlMessage: "User netered a character out of acceptable range.",
                toString: function () {
                    return this.name + ": " + this.message;
                }
            };
        }
        updateValueAtCursor(parseInt(value));
        $("#inputForm").hide();
        $("#input").prop("disabled", true);

        state = lastState;;
        handleCode(lastArray, lastX, lastY);
    }
}

function adjustCursor() {
    if (cursor < 0 || cursor > cells - 1) {
        throw{
            name: "Memory Error",
            level: "Bad",
            message: "Cursor tried to access memory out of bounds.",
            htmlMessage: "Cursor tried to access memory out of bounds.",
            toString: function () {
                return this.name + ": " + this.message;
            }
        };
    }
    var refTab = document.getElementById("cellTable");
    // Loop through all rows and columns of the table and popup alert with the value
    // /content of each cell.
    for (var i = 0; row = refTab.rows[i]; i++) {
        row = refTab.rows[i];
        for (var j = 0; col = row.cells[j]; j++) {
            if (j === cursor) {
                col.style = "background-color: " + highlightedCell;
            } else {
                col.style = "background-color: " + normalCell;
            }
        }
    }
}

function incrementCursor() {
    cursor++;
    adjustCursor();
}

function decrementCursor() {
    cursor--;
    adjustCursor();
}

function toggleInput() {
    if (!inputVisible) {
        $("#code").show();
        inputVisible = true;
    } else {
        $("#code").hide();
        inputVisible = false;
    }
}

function togglePanel() {
    var rawCode = $("#code").val();
    rawCode = rawCode.replace(/\n/g, "<br>");
    $("#codeBody").html(rawCode);
    if (!panelVisible) {
        $("#runtimePanels").show();
        panelVisible = true;
    } else {
        $("#runtimePanels").hide();
        panelVisible = false;
    }
}

function initializeArray() {
    var rawCode = $("#code").val();
    var codeArray = [];
    codeArray.push([]);
    var line = 0;
    for (var i = 0; i < rawCode.length; i++) {
        if (rawCode[i] === "\n") {
            codeArray.push([]);
            line++;
        } else if (rawCode[i] !== " ") {
            codeArray[line].push(rawCode[i]);
        }
    }
    var arr = []
    for (var i = 0; i < codeArray.length; i++) {
        if (codeArray[i] && codeArray[i].length > 0) {
            arr.push(codeArray[i]);
        }
    }
    return arr;
}

function zeroArray() {
    var refTab = document.getElementById("cellTable");
    for (var i = 0; row = refTab.rows[i]; i++) {
        row = refTab.rows[i];
        for (var j = 0; col = row.cells[j]; j++) {
            col.innerHTML = "0";
        }
    }
}

function clearOutput() {
    $("#outputBody").empty();
}

function handleCode(codeArray, index1, index2) {
    setTimeout(function () {
        var tup= handleChar(codeArray[index1][index2], index1, index2);
        index1 = tup[0];
        index2 = ++tup[1];
        if(index2 >= codeArray[index1].length){
            index1++;
            index2 = 0;
        }
        if(state === runningStates.RUNNING && index1 < codeArray.length && index2 < codeArray[index1].length){
            handleCode(codeArray, index1, index2);
        } else {
            lastX = index1;
            lastY = index2;
            lastArray = codeArray;
        }
    }, stepWait);
}

function updateStep() {
    stepWait = $("#step").val() * 10;
}

$(document).ready(function () {
    $("#startButton").bind("click", startButton);
    $("#pauseButton").bind("click", pauseButton);
    $("#stepButton").bind("click", stepButton);
    $("#stopButton").bind("click", stopButton);
    $("#submit").bind("click", submitButton);
    $("#step").bind("change", updateStep);
});