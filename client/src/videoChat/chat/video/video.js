(function (angular) {

    'use strict';

    angular
        .module('videoChat.chat.video', [
            'ui.router'
        ])
        .directive('vcVideo', [
            videoDirective
        ]);

    function videoDirective(){
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: videoController,
            controllerAs: 'videoCtrl',
            templateUrl: 'videoChat/chat/video/video.html'
        };

        function videoController() {
            var video = this;

            console.log('video init');
        }
    }

})(angular);