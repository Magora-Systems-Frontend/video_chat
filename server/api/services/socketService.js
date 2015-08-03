(function () {

    'use strict';

    var requireDir = require('require-dir');
    var controllers = requireDir('../controllers');

    var io;

    var connections = function(http){

        io = require('socket.io')(http);
        var users = {};

        io.on('connection', function(socket){

            socket.on('login', function(message){
               //var message = JSON.parse(message);
                var res = {
                    redirect: redirect
                };
                var req = {
                    body: {
                        login: message.login,
                        password: message.password
                    }
                };
                controllers['authController']['actionLogin'](req, res);
            });

            function redirect(route){
                switch (route){
                    case '/': sendToken(); break;
                    case 'login': closeConnection(); break;
                }
            }

            function sendToken(){
                socket.emit('setToken', {})
            }

            function closeConnection(){
                socket.disconnect('unauthorized');
            }

            function onLogin() {
                console.log('authorized');

                /**
                 * @params message - {userId, }
                 */
                socket.on("room", function (message) {
                    var message = JSON.parse(message);
                    users[message.userId] = socket;
                    if (socket.room !== undefined) {
                        socket.leave(socket.room);
                    }
                    socket.room = message.room;
                    socket.join(socket.room);
                    socket.user_id = message.userId;
                    //var message = getUser();
                    socket.broadcast.in(socket.room).emit("knock-knock", message);
                });

                /**
                 * broadcast in room user message
                 * @params message - {userId, data:{}}
                 */
                socket.on("message", function (message) {
                    var message = JSON.parse(message);
                    if (!users[message.userId])
                        throw new Error('User not exist in any room');
                    var socket = users[message.userId];
                    socket.join(socket.room);
                    socket.user_id = message.userId;
                    socket.broadcast.to(socket.room).emit("say", message);
                });
            }
        });
    };

    module.exports = connections;
})();