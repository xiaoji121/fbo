/**
 * Created by dongming on 14-12-1.
 */

var app = angular.module("sampleApp", ["firebase", "ngRoute"]);
// let's create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
    var ref = new Firebase("https://fbo.firebaseio.com/");
    return $firebaseAuth(ref);
}]);
// and use it in our controller
app.controller("SampleCtrl", ["$scope", "Auth", function($scope, Auth) {
    $scope.auth = Auth;
    $scope.user = $scope.auth.$getAuth();

    $scope.logOut = function() {
        if ($scope.user) {
            $scope.auth.$unauth()
        }
    };

    $scope.auth.$onAuth(function(authData) {
        if (authData) {
            console.log("登陆成功，用户名", authData.github.username);
        } else {
            console.log("退出成功");
        }
    });

}]);

app.run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/home");
        }
    });
}]);

app.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/home", {
        // the rest is the same for ui-router and ngRoute...
        controller: "HomeCtrl",
        templateUrl: "views/home.html",
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth", function(Auth) {
                // $waitForAuth returns a promise so the resolve waits for it to complete
                return Auth.$waitForAuth();
            }]
        }
    }).when("/account", {
        // the rest is the same for ui-router and ngRoute...
        controller: "AccountCtrl",
        templateUrl: "views/account.html",
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth", function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }]
        }
    });
}]);

app.controller("HomeCtrl", ["currentAuth", function(currentAuth) {
    // currentAuth (provided by resolve) will contain the
    // authenticated user or null if not logged in
    console.log(currentAuth);
}]);

app.controller("AccountCtrl", ["currentAuth", function(currentAuth) {
    // currentAuth (provided by resolve) will contain the
    // authenticated user or null if not logged in
}]);