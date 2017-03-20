var app = angular.module('BFI', []);
var cells = 20;
var arrowURL = "img/arrow.png";

var cursor = 0;

app.controller('TapeCtrl', ['$scope', function ($scope) {
        $scope.cells = new Array(cells).fill(0);
    }]);