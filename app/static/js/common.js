/**
 * Created by dongming on 14-12-2.
 */

var app = angular.module('myFbo.common', ['firebase']);

app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
    var ref = new Firebase("https://fbo.firebaseio.com/");
    return $firebaseAuth(ref);
}]);

app.controller("AuthCtrl", ["$scope", "Auth", '$location', function($scope, Auth, $location) {
    $scope.userInfo = Auth.$getAuth();

    $scope.isLogin = $scope.userInfo ? true : false;

    $scope.login = function() {
        return Auth.$authWithOAuthPopup('github');
    };

    $scope.logout = function() {
        if ($scope.isLogin) {
            return Auth.$unauth();
        }

        return;
    };

    Auth.$onAuth(function(authData) {
        if (authData) {
            console.log('log in ....')
            $scope.isLogin = true;
            $location.path('/home');
        } else {
            console.log('logout.....')
            $scope.isLogin = false;
        }
    });

}]);
