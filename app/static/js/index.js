/**
 * Created by dongming on 14-12-1.
 */

var app = angular.module('myFbo', [
    'myFbo.common',
    'myFbo.router'
]);

app.controller('IndexCtrl', ['$location', 'Auth', function($location, Auth) {
    if (Auth.$getAuth()) {
       $location.path('/home');
    }
}]);