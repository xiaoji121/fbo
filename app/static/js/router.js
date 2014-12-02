/**
 * Created by dongming on 14-12-2.
 */
var app = angular.module('myFbo.router', ['ngRoute', 'myFbo.common']);

app.run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page

        if (error === "AUTH_REQUIRED") {
            $location.path("/home");
        }
    });
}]);

app.config(["$routeProvider", function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/home", {
            controller: "HomeCtrl",
            templateUrl: "views/home/home.html",
            resolve: {
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
                }]
            }
        })
        .when("/account", {
            controller: "AccountCtrl",
            templateUrl: "views/account/account.html",
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
    if (!currentAuth) {
//        AuthCtrl.login();
    }
}]);

app.controller("AccountCtrl", ["currentAuth", function(currentAuth) {
    // currentAuth (provided by resolve) will contain the
    // authenticated user or null if not logged in
}]);