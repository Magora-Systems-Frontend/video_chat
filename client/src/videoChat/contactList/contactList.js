(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList', [
            'ui.router',
            'videoChat.contactList.room',
            'videoChat.contactList.user'
        ])
        .directive('vcContactList', [
            contactListDirective
        ]);

    function contactListDirective(){
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

        contactListController.$inject = ['$state'];

        function contactListController($state) {
            var contactList = this;

            contactList.type = $state.type || 'user';

            console.log('contactList init');
        }
    }

})(angular);