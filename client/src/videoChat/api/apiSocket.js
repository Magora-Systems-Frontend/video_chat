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
            ioSocket: io.connect(apiUrl, {login: 'test1', password: '123'})
        };
        var socket = socketFactory(socketConfig);

        socket.on('connect', function(){
            socket.emit('login', {
                login: "test1",
                password: "123"
            });
            socket.on('setToken', function(message){
                window.sessionStorage["videoChat"] = message.token;
            });
        });

        return socket;
    }

})(angular);
