(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList.user', [
            'videoChat.api.users',
            'ui.router'
        ])
        .directive('vcUser', userDirective);

    userDirective.$inject = ['apiUsersFactory'];

    function userDirective(apiUsersFactory) {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: userController,
            controllerAs: 'userCtrl',
            templateUrl: 'videoChat/contactList/user/user.html'
        };

        function userController() {
            var user = this;

            user.list = apiUsersFactory.list;
            user.options = {
                type: 'user',
                status: true
            };

            console.log('user init');
        }
    }

})(angular);