(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList.room', [
            'ui.router',
            'videoChat.api.room',
            'videoChat.contactList.contact'
        ])
        .directive('vcRoom', roomDirective);


    roomDirective.$inject = ['apiRoomFactory'];

    function roomDirective(apiRoomFactory) {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: roomController,
            controllerAs: 'roomCtrl',
            templateUrl: 'videoChat/contactList/room/room.html'
        };

        function roomController() {
            var roomCtrl = this;

            roomCtrl.list = apiRoomFactory.list;

            console.log('room opened');
        }
    }
})(angular);