/**
 * Created by akulov on 28.07.2015.
 */
var tmpSocket = null;
(function (angular) {

    'use strict';

    apiSocketFactory.$inject = ["socketFactory", "apiUrl"];

    angular
        .module('videoChat.api', [
            "btford.socket-io",
            "videoChat.constants"
        ])
        .factory('apiSocketFactory', apiSocketFactory);

    function apiSocketFactory(socketFactory, apiUrl) {
        var socketConfig = {
            ioSocket: io.connect(apiUrl)
        };
        console.log(apiUrl);
        var socket = socketFactory(socketConfig);

        socket.on('usersList', function(message){
            console.log('usersList');
            console.log(message);
        });

        socket.on('newUser', function(message){
            console.log('newUser: ' + message);
        });

        socket.on('usersNotFound', function(){
            console.log('usersNotFound');
        });

        socket.on('roomsList', function(message){
            console.log('roomsList');
            console.log(message);
        });

        socket.on('userDisconnected', function(message){
            console.log('userDisconnected: ' + message);
        });

        socket.on('userDisconnectedFromRoom', function(message){
            console.log('userDisconnectedFromRoom: ' + message);
        });




        socket.on('roomCreated', function(message){
            console.log('roomCreated');
            console.log(message);
        });

        socket.on('userJoined', function(message){
            console.log('userJoined');
            console.log(message);
        });

        socket.on('newMessage', function(message){
            console.log('newMessage');
            console.log(message);
        });

        tmpSocket = socket;

        return socket;
    }

})(angular);
