(function (angular) {

    'use strict';

    angular
        .module('videoChat.chat.text', [])
        .directive('vcText', [
            textDirective
        ]);

    function textDirective(){
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: textController,
            controllerAs: 'textCtrl',
            templateUrl: 'videoChat/chat/text/text.html'
        };

        function textController() {
            var text = this;

            console.log('text init');
        }
    }

})(angular);