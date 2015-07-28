(function (angular) {
    'use strict';

    angular
        .module('VideoChat', [
            'btford.socket-io',
            'ui.router',
            'videoChat.chat',
            'videoChat.contactList'
        ])
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$locationProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $locationProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');


        $stateProvider
            .state('homepage', {
                url: '/',
                templateUrl: 'videoChat/videoChat.html'
            });
    }
})(angular);