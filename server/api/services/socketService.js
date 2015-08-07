(function () {

    'use strict';

    var requireDir = require('require-dir');
    var controllers = requireDir('../controllers');
    var User = require('../models/User');

    var io;

    var connections = function(server){

        var io = require('socket.io')(server);

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

            socket.on('disconnect', function(){
                console.log('disconnected:' + socket.id);
                console.log(socket.rooms);

                for(var i = 0; i < socket.rooms.length; i++) {
                    socket.broadcast.to(socket.rooms[i]).emit('userDisconnected', socket.id);
                }

                delete users[socket.id];
            });
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

                socket.on("room", function (message) {
                    var message = JSON.parse(message);

                    if(!~Object.keys(rooms).indexOf(message.room)) {
                        rooms[message.room] = {isPublic: message.isPublic, users: message.users};

                        for(var i = 0; i < message.users.length; i++) {
                            console.log(users[message.users[i]]);
                            users[message.users[i]].join(message.room, function(err){ if(err) console.log(err)});
                        }


                        rooms[message.room].users.push(socket.id);
                        socket.join(message.room);
                        io.to(message.room).emit('roomCreated', {room: message.room, users: rooms[message.room].users, rooms: Object.keys(rooms)});
                    } else {
                        if(!~rooms[message.room].users.indexOf(socket.id)) {
                            rooms[message.room].users.push(socket.id);
                            socket.join(message.room);
                            socket.broadcast.to(message.room).emit('userJoined', {room: message.room, user: socket.id});
                        }
                    }
                });

                socket.on("leave", function () {
                    console.log('leaved');
                })

                socket.on("message", function (message) {
                    var message = JSON.parse(message);
                    if(~Object.keys(rooms).indexOf(message.room)) {
                        socket.broadcast.to(message.room).emit('newMessage', {room: message.room, sender: socket.id, message: message.message});
                    } else {
                        console.log('Room not exist');
                    }
                });
            }
        });
    };

    module.exports = connections;
})();