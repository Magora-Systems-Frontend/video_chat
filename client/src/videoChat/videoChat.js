(function (angular) {
    'use strict';

    angular
        .module('VideoChat', [
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
            })
            .state('homepage.chat', {
                url: ':type/:id',
                templateUrl: 'videoChat/videoChat.html'
            });
    }
})(angular);