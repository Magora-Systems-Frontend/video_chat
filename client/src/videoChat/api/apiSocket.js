/**
 * Created by akulov on 28.07.2015.
 */
(function (angular) {

    'use strict';

    angular
        .module('VideoChat').factory('apiSocket', apiSocket);

    function apiSocket(socketFactory) {
        var socket = socketFactory();
        socket.forward('error');
        return socket;
    }

})(angular);
