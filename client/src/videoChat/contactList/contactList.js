(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList', [
            'ui.router',
            'videoChat.contactList.room',
            'videoChat.contactList.user'
        ])
        .directive('vcContactList', contactListDirective);

    contactListDirective.$inject = ['$state'];

    function contactListDirective($state) {
        return {
            restrict: 'E',
            scope: {
                type: '='
            },
            bindToController: true,
            controller: contactListController,
            controllerAs: 'contactListCtrl',
            templateUrl: 'videoChat/contactList/contactList.html'
        };

        function contactListController() {
            var contactList = this;

            contactList.type = $state.type || 'user';

            console.log('contactList init');
        }
    }

})(angular);