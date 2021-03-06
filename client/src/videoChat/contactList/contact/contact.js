(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList.contact', [
            'ui.router'
        ])
        .directive('vcContact', contactDirective);

    function contactDirective() {
        return {
            restrict: 'E',
            scope: {
                type: '@',
                name: '=',
                id: '=',
                hasStatus: '='
            },
            templateUrl: 'videoChat/contactList/contact/contact.html'
        };
    }

})(angular);