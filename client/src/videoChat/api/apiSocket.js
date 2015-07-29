/**
 * Created by akulov on 28.07.2015.
 */
(function (angular) {

    'use strict';

    apiSocketFactory.$inject = ["socketFactory", "apiUrl"];

    angular
        .module('videoChat.api', [
            "btford.socket-io"
        ])
        .constant('apiUrl', 'http://localhost:8088')
        .factory('apiSocketFactory', apiSocketFactory);

    function apiSocketFactory(socketFactory, apiUrl) {
        var socketConfig = {
            //prefix:
            ioSocket: io.connect(apiUrl)
        };
        var socket = socketFactory(socketConfig);
        socket.forward('error');
        return socket;
    }

})(angular);
