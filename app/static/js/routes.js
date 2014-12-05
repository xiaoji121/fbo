/**
 * Created by dongming on 14-12-5.
 */

"use strict";

angular.module('myFbo.routes', ['ngRoute', 'simpleLogin'])

    .constant('ROUTES', {
        '/welcome': {
            templateUrl: 'partials/welcome.html',
            controller: 'WelcomeCtrl'
        },
        '/register': {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
        },
        '/home': {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl',
            authRequired: true
//            resolve: {
//                // controller will not be loaded until $waitForAuth resolves
//                // Auth refers to our $firebaseAuth wrapper in the example above
//                "currentAuth": ["Auth", function(Auth) {
//                    // $waitForAuth returns a promise so the resolve waits for it to complete
//                    return Auth.$waitForAuth();
//                }]
//            }
        },
        '/chat': {
            templateUrl: 'partials/chat.html',
            controller: 'ChatCtrl'
        },
        '/login': {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        },
        '/account': {
            templateUrl: 'partials/account.html',
            controller: 'AccountCtrl',
            // require user to be logged in to view this route
            // the whenAuthenticated method below will resolve the current user
            // before this controller loads and redirect if necessary
            authRequired: true
        }
    })

/**
 * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
 * when called, invokes the requireUser() service (see simpleLogin.js).
 *
 * The promise either resolves to the authenticated user object and makes it available to
 * dependency injection (see AuthCtrl), or rejects the promise if user is not logged in,
 * forcing a redirect to the /login page
 */
    .config(['$routeProvider', function($routeProvider) {
        // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
        // unfortunately, a decorator cannot be use here because they are not applied until after
        // the .config calls resolve, so they can't be used during route configuration, so we have
        // to hack it directly onto the $routeProvider object
        $routeProvider.whenAuthenticated = function(path, route) {
            route.resolve = route.resolve || {};
            route.resolve.currentAuth = ['Auth', function(Auth) {
                return Auth.$waitForAuth();
            }];
            $routeProvider.when(path, route);
        }
    }])

    // configure views; the authRequired parameter is used for specifying pages
    // which should only be available while logged in
    .config(['$routeProvider', 'ROUTES', function($routeProvider, ROUTES) {
        angular.forEach(ROUTES, function(route, path) {
            if( route.authRequired ) {
                // adds a {resolve: user: {...}} promise which is rejected if
                // the user is not authenticated or fulfills with the user object
                // on success (the user object is then available to dependency injection)
                $routeProvider.whenAuthenticated(path, route);
            }
            else {
                // all other routes are added normally
                $routeProvider.when(path, route);
            }
        });
        // routes which are not in our map are redirected to /home
        $routeProvider.otherwise({redirectTo: '/welcome'});
    }])

/**
 * Apply some route security. Any route's resolve method can reject the promise with
 * { authRequired: true } to force a redirect. This method enforces that and also watches
 * for changes in auth status which might require us to navigate away from a path
 * that we can no longer view.
 */
    .run(['$rootScope', '$location', 'simpleLogin', 'ROUTES', 'loginRedirectPath',
        function($rootScope, $location, simpleLogin, ROUTES, loginRedirectPath) {
            // watch for login status changes and redirect if appropriate
            simpleLogin.watch(check, $rootScope);

            // some of our routes may reject resolve promises with the special {authRequired: true} error
            // this redirects to the login page whenever that is encountered
            $rootScope.$on("$routeChangeError", function(e, next, prev, err) {
                if( angular.isObject(err) && err.authRequired ) {
                    $location.path(loginRedirectPath);
                }
            });

            function check(user) {
                if( !user && authRequired($location.path()) ) {
                    $location.path(loginRedirectPath);
                }
            }

            function authRequired(path) {
                return ROUTES.hasOwnProperty(path) && ROUTES[path].authRequired;
            }
        }
    ]);
