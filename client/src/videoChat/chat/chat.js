(function (angular) {

    'use strict';

    angular
        .module('videoChat.chat', [
            'ui.router',
            'videoChat.chat.text',
            'videoChat.chat.video'
        ])
        //.config(config)
        .directive('vcChat', chatDirective);

    //config.$inject = ['$stateProvider'];

    //function config($stateProvider) {
    //    $stateProvider.
    //        state('homepage.chat', {
    //            url: 'chat',
    //            templateUrl: 'videoChat/chat/chat.html'
    //        });
    //}

    function chatDirective(){
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: chatController,
            controllerAs: 'chat',
            templateUrl: 'videoChat/chat/chat.html'
        };

        function chatController() {
            var chat = this;

            console.log('chat started');
        }
    }

})(angular);