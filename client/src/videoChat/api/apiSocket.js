/**
 * Created by akulov on 28.07.2015.
 */
(function (angular) {

    'use strict';

    angular
        .module('VideoChat.api').factory('apiSocket', apiSocket)
        .constant('apiUrl', 'http://localhost:8088');

    apiSocket.$inject = ["btford.socket-io", "apiUrl"];

    function apiSocket(socketFactory, apiUrl) {
        var socketConfig = {
            //prefix:
            ioSocket: io.connect(apiUrl)
        };
        var socket = socketFactory(socketConfig);
        socket.forward('error');
        return socket;
    }

})(angular);
