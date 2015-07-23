(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList.room', [
            'ui.router',
            'videoChat.api.rooms'
        ])
        //.config(config)
        .directive('vcRoom', roomDirective);

    //config.$inject = ['$stateProvider'];

    //function config($stateProvider) {
    //    $stateProvider.
    //        state('homepage.room', {
    //            url: 'room',
    //            templateUrl: 'videoChat/room/room.html'
    //        });
    //}

    roomDirective.$inject = ['apiRoomsFactory'];

    function roomDirective(apiRoomsFactory){
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: roomController,
            controllerAs: 'roomCtrl',
            templateUrl: 'videoChat/contactList/room/room.html'
        };

        function roomController() {
            var room = this;

            room.list = apiRoomsFactory.list;

            console.log('room opened');
        }
    }

})(angular);