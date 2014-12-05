/**
 * Created by dongming on 14-12-4.
 */

'use strict';

/* Directives */


angular.module('myFbo.directives', [])

    .directive('appVersion', ['version', function(version) {
        return function(scope, elm) {
            elm.text(version);
        };
    }])

/**
 * A directive that shows elements only when user is logged in.
 */
    .directive('ngShowAuth', ['simpleLogin', '$timeout', function (simpleLogin, $timeout) {
        var isLoggedIn;
        simpleLogin.watch(function(user) {
            isLoggedIn = !!user;
        });

        return {
            restrict: 'A',
            link: function(scope, el) {
                el.addClass('ng-cloak'); // hide until we process it

                function update() {
                    // sometimes if ngCloak exists on same element, they argue, so make sure that
                    // this one always runs last for reliability
                    $timeout(function () {
                        el.toggleClass('ng-cloak', !isLoggedIn);
                    }, 0);
                }

                update();
                simpleLogin.watch(update, scope);
            }
        };
    }])

/**
 * A directive that shows elements only when user is logged out.
 */
    .directive('ngHideAuth', ['simpleLogin', '$timeout', function (simpleLogin, $timeout) {
        var isLoggedIn;
        simpleLogin.watch(function(user) {
            isLoggedIn = !!user;
        });

        return {
            restrict: 'A',
            link: function(scope, el) {
                function update() {
                    el.addClass('ng-cloak'); // hide until we process it

                    // sometimes if ngCloak exists on same element, they argue, so make sure that
                    // this one always runs last for reliability
                    $timeout(function () {
                        el.toggleClass('ng-cloak', isLoggedIn !== false);
                    }, 0);
                }

                update();
                simpleLogin.watch(update, scope);
            }
        };
    }])


    .directive('dtRegister', ['simpleLogin', '$location', function(simpleLogin, $location) {
        return {
            restrict: "EA",
            replace: true,
            templateUrl: 'static/tpl/register.html',
            controller: function($scope) {
                $scope.password = '';
                $scope.confirmPassword = '';

                $scope.confirmPasswordValid = function() {
                    if ($scope.password && $scope.confirmPassword && $scope.password === $scope.confirmPassword) {
                        return true;
                    }

                    return false;
                };

                $scope.createAccount = function() {
                    simpleLogin.createAccount($scope.email, $scope.password)
                        .then(function(/* user */) {
                            $location.path('/home');
                        }, function(err) {
                            $scope.err = errMessage(err);
                        });
                }
            }

        };

        function errMessage(err) {
            return angular.isObject(err) && err.code? err.code : err + '';
        }
    }])

    .directive('dtLogin', ['simpleLogin', '$location', function(simpleLogin, $location) {
        return {
            restrict: "EA",
            replace: true,
            templateUrl: 'static/tpl/login.html',
            scope: {

            },

            controller: function($scope) {
                $scope.loginFbo = function(email, pass) {
                    $scope.err = null;
                    simpleLogin.login(email, pass)
                        .then(function(/* user */) {
                            $location.path('/home');
                        }, function(err) {
                            $scope.err = errMessage(err);
                        });
                };
            }

        };

        function errMessage(err) {
            return angular.isObject(err) && err.code? err.code : err + '';
        }
    }]);

