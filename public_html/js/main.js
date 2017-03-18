var app = angular.module('BFI', []);

app.controller('TapeCtrl', ['$scope', function ($scope) {
        $scope.cells = new Array(20).fill(0);
    }]);