/**
 * Created by akulov on 29.07.2015.
 */
(function (angular) {

    'use strict';

    angular
        .module('videoChat.constants', [
            "btford.socket-io"
        ])
        .constant('apiUrl', 'localhost:8088');

})(angular);