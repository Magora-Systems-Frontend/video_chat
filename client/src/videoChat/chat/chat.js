(function (angular) {

    'use strict';

    angular
        .module('videoChat.chat', [
            'ui.router',
            'videoChat.chat.text',
            'videoChat.chat.video'
        ]).config(config);

    config.$inject = [
        '$stateProvider'
    ];

    function config($stateProvider) {

        $stateProvider
            .state('homepage.chat', {
                url: ':type/:roomId',
                templateUrl: 'videoChat/chat/chat.html'
            });
    }

})(angular);