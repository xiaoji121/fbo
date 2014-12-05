/**
 * Created by dongming on 14-12-5.
 */


angular.module('simpleLogin', ['firebase', 'firebase.utils', 'changeEmail'])

    // a simple wrapper on simpleLogin.getUser() that rejects the promise
    // if the user does not exists (i.e. makes user required)
    .factory('Auth', ['$firebaseAuth', 'fbutil', function($firebaseAuth, fbutil) {
        return $firebaseAuth(fbutil.ref());
    }])

    .factory('simpleLogin', ['Auth', 'createProfile', 'changeEmail', '$q', '$rootScope',
        function(Auth, createProfile, changeEmail, $q, $rootScope) {
            var auth = Auth;
            var listeners = [];

            function statusChange() {
                var user = fns.getUser();

                fns.user = user || null;
                angular.forEach(listeners, function(fn) {
                    fn(user||null);
                });
            }

            var fns = {
                user: null,

                getUser: function() {
                    return auth.$getAuth();
                },

                /**
                 * @param {string} email
                 * @param {string} pass
                 * @returns {*}
                 */
                login: function(email, pass) {
                    return auth.$authWithPassword({
                        email: email,
                        password: pass,
                        rememberMe: true
                    });
                },

                logout: function() {
                    auth.$unauth();
                },

                createAccount: function(email, pass, name) {
                    return auth.$createUser(email, pass)
                        .then(function() {
                            // authenticate so we have permission to write to Firebase
                            return fns.login(email, pass);
                        })
                        .then(function(user) {
                            // store user data in Firebase after creating account
                            return createProfile(user.uid, email, name).then(function() {
                                return user;
                            })
                        });
                },

                changePassword: function(email, oldpass, newpass) {
                    return auth.$changePassword(email, oldpass, newpass);
                },

                changeEmail: function(password, newEmail) {
                    return changeEmail(password, fns.user.email, newEmail, this);
                },

                removeUser: function(email, pass) {
                    return auth.$removeUser(email, pass);
                },

                watch: function(cb, $scope) {
                    var user = fns.getUser();
                    cb(user);

                    listeners.push(cb);
                    var unbind = function() {
                        var i = listeners.indexOf(cb);
                        if( i > -1 ) { listeners.splice(i, 1); }
                    };
                    if( $scope ) {
                        $scope.$on('$destroy', unbind);
                    }
                    return unbind;
                }
            };

            $rootScope.$on('auth:login', statusChange);
            $rootScope.$on('auth:logout', statusChange);
            $rootScope.$on('auth:error', statusChange);
            statusChange();

            return fns;
        }])

    .factory('createProfile', ['fbutil', '$q', '$timeout', function(fbutil, $q, $timeout) {
        return function(id, email, name) {
            var ref = fbutil.ref('users', id), def = $q.defer();
            ref.set({email: email, name: name||firstPartOfEmail(email)}, function(err) {
                $timeout(function() {
                    if( err ) {
                        def.reject(err);
                    }
                    else {
                        def.resolve(ref);
                    }
                })
            });

            function firstPartOfEmail(email) {
                return ucfirst(email.substr(0, email.indexOf('@'))||'');
            }

            function ucfirst (str) {
                // credits: http://kevin.vanzonneveld.net
                str += '';
                var f = str.charAt(0).toUpperCase();
                return f + str.substr(1);
            }

            return def.promise;
        }
    }]);
