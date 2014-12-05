/**
 * Created by dongming on 14-12-5.
 */

'use strict';

/* Controllers */

angular.module('myFbo.controllers', ['firebase.utils', 'simpleLogin'])

    .controller('HomeCtrl', ['$scope', 'fbutil', 'simpleLogin', '$location', function($scope, fbutil, simpleLogin, $location) {
        $scope.syncedValue = fbutil.syncObject('syncedValue');
        $scope.logout = function() {
            simpleLogin.logout();
            $location.path('/welcome');
        };

        console.log($scope.syncedValue);

//        console.log($scope.user);
    }])

    .controller('WelcomeCtrl', ['$scope', 'simpleLogin', function($scope, simpleLogin) {
//        $scope.logout = simpleLogin.logout;
    }])

    .controller('RegisterCtrl', ['$scope', function($scope) {

    }])

    .controller('ChatCtrl', ['$scope', 'messageList', function($scope, messageList) {
        $scope.messages = messageList;
        $scope.addMessage = function(newMessage) {
            if( newMessage ) {
                $scope.messages.$add({text: newMessage});
            }
        };
    }])

    .controller('LoginCtrl', ['$scope', 'simpleLogin', '$location', function($scope, simpleLogin, $location) {

    }])

    .controller('AccountCtrl', ['$scope', 'simpleLogin', 'fbutil', 'user', '$location',
        function($scope, simpleLogin, fbutil, user, $location) {
            // create a 3-way binding with the user profile object in Firebase
            var profile = fbutil.syncObject(['users', user.uid]);
            profile.$bindTo($scope, 'profile');

            // expose logout function to scope
            $scope.logout = function() {
                profile.$destroy();
                simpleLogin.logout();
                $location.path('/login');
            };

            $scope.changePassword = function(pass, confirm, newPass) {
                resetMessages();
                if( !pass || !confirm || !newPass ) {
                    $scope.err = 'Please fill in all password fields';
                }
                else if( newPass !== confirm ) {
                    $scope.err = 'New pass and confirm do not match';
                }
                else {
                    simpleLogin.changePassword(profile.email, pass, newPass)
                        .then(function() {
                            $scope.msg = 'Password changed';
                        }, function(err) {
                            $scope.err = err;
                        })
                }
            };

            $scope.clear = resetMessages;

            $scope.changeEmail = function(pass, newEmail) {
                resetMessages();
                profile.$destroy();
                simpleLogin.changeEmail(pass, newEmail)
                    .then(function(user) {
                        profile = fbutil.syncObject(['users', user.uid]);
                        profile.$bindTo($scope, 'profile');
                        $scope.emailmsg = 'Email changed';
                    }, function(err) {
                        $scope.emailerr = err;
                    });
            };

            function resetMessages() {
                $scope.err = null;
                $scope.msg = null;
                $scope.emailerr = null;
                $scope.emailmsg = null;
            }
        }
    ]);