(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList.user', [
            'videoChat.api.users',
            'videoChat.contactList.contact',
            'ui.router'
        ])
        .directive('vcUser', userDirective);

    userDirective.$inject = ['apiUserFactory'];

    function userDirective(apiUserFactory) {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: userController,
            controllerAs: 'userCtrl',
            templateUrl: 'videoChat/contactList/user/user.html'
        };

        function userController() {
            var userCtrl = this;

            userCtrl.list = apiUserFactory.list;

            console.log('user init');
        }
    }

})(angular);