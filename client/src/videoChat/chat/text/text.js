(function (angular) {

    'use strict';

    angular
        .module('videoChat.chat.text', [])
        .directive('vcText', textDirective);


    function textDirective() {

        textController.$inject = ['$state', 'apiMessageFactory'];

        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: textController,
            controllerAs: 'textCtrl',
            templateUrl: 'videoChat/chat/text/text.html'
        };

        function textController($state, apiMessageFactory) {
            var textCtrl = this;
            textCtrl.roomId = $state.params.roomId;

            apiMessageFactory.loadMessagesByUser('currentUserId', textCtrl.roomId);
            textCtrl.list = apiMessageFactory.list;


        }
    }

})(angular);