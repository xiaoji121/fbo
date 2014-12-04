/**
 * Created by dongming on 14-12-4.
 */

'use strict';

/* Directives */


angular.module('myFbo.directives', [])

    .directive('dtAppVersion', ['version', function(version) {
        return function(scope, elm) {
            elm.text(version);
        };
    }])

    .directive('dtRegister', function() {
        return {
            restrict: "EA",
            replace: true,
            templateUrl: 'static/tpl/register.html',

            link: function (scope, element, attrs) {

                scope.password = '';
                scope.confirmPassword = '';

                scope.confirmPasswordValid = function() {
                    if (scope.password && scope.confirmPassword && scope.password === scope.confirmPassword) {
                        return true;
                    }

                    return false;
                };
            }

        };
    });

