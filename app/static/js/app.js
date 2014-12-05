/**
 * Created by dongming on 14-12-4.
 */

'use strict';

// Declare app level module which depends on filters, and services
angular.module('myFbo', [
    'myFbo.config',
    'myFbo.directives',
    'myFbo.routes',
    'myFbo.controllers',
    'ui.bootstrap'

])
    .run(['simpleLogin', function(simpleLogin) {
        console.log('run'); //debug
        var user = simpleLogin.getUser();

        console.log(user);
    }]);