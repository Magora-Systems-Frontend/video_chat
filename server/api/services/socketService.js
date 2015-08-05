(function () {

    'use strict';

    var requireDir = require('require-dir');
    var controllers = requireDir('../controllers');
    var User = require('../models/User');

    var io;

    var connections = function(http){

        io = require('socket.io')(http);
        var users = {};
        var rooms = {};

        io.on('connection', function(socket){

            console.log('connected ' + socket.id);

            var parameters = socket.handshake.query;

            socket.emit('usersList', Object.keys(users));

            var publicRooms = [];
            for(var i in rooms) {
                if(rooms[i].isPublic)
                    publicRooms.push(i);
            }

            socket.emit('roomsList', publicRooms);

            users[socket.id] = socket;

            socket.broadcast.emit('newUser', socket.id);

            onLogin();

            //var user = User.findUnique(parameters.userName, parameters.email);

            //console.log(user._id);
            //if(!user._id) {
            //    var req = {
            //        body: {
            //            userName: parameters.userName,
            //            password: parameters.password,
            //            email: parameters.email
            //        }
            //    };
            //    controllers['authController']['actionRegister'](req, onLogin);
            //}

            //socket.on('login', function(message){
            //   //var message = JSON.parse(message);
            //    var res = {
            //        redirect: redirect
            //    };
            //    var req = {
            //        body: {
            //            login: message.login,
            //            password: message.password
            //        }
            //    };
            //    controllers['authController']['actionLogin'](req, res);
            //});

            function redirect(route){
                switch (route){
                    case '/': sendToken(); break;
                    case 'login': closeConnection(); break;
                }
            }

            function sendToken(){
                //onLogin();
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

                    if(!~Object.keys(rooms).indexOf(message.room)) {
                        rooms[message.room] = {isPublic: message.isPublic, users: message.users};

                        for(var i = 0; i < message.users.length; i++) {
                            users[message.users[i]].join(message.room);
                        }

                        rooms[message.room].users.push(socket.id);
                        socket.join(message.room);
                        io.to(message.room).emit('roomCreated', rooms[message.room].users);
                    }

                    if(!~rooms[message.room].users.indexOf(socket.id)) {
                        rooms[message.room].users.push(socket.id);
                        io.to(message.room).emit('some event')
                        socket.join(message.room);
                    }


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