(function () {

    'use strict';

    var requireDir = require('require-dir');
    var controllers = requireDir('../controllers');
    var _ = require('underscore');
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

            users[socket.id] = {socket: socket, rooms: []};

            socket.broadcast.emit('newUser', socket.id);

            onLogin();

            socket.on('disconnect', function(){
                console.log('disconnected:' + socket.id);

                var usersRooms = users[socket.id].rooms;
                for(var i = 0; i < usersRooms.length; i++) {
                    io.to(usersRooms[i]).emit('userDisconnectedFromRoom', {user: socket.id, room: usersRooms[i]});

                    var index = -1;
                    if(~(index = rooms[usersRooms[i]].users.indexOf(socket.id))) {
                        rooms[usersRooms[i]].users.splice(index, 1);
                    }

                    // Should be deleted?
                    if(!rooms[usersRooms[i]].users.length)
                        delete rooms[usersRooms[i]];
                }

                socket.broadcast.emit('userDisconnected', socket.id);
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

            function addUserToRoom(userSocket, room) {
                rooms[room].users.push(userSocket.id);
                userSocket.join(room);
                users[userSocket.id].rooms.push(room);
            }

            function onLogin() {
                console.log('authorized');

                socket.on("room", function (message) {
                    console.log(typeof message);

                    if(!~Object.keys(rooms).indexOf(message.room)) {

                        // create room
                        var usersToConnect = _.intersection(Object.keys(users), message.users);

                        if(!usersToConnect.length) {
                            console.log('users not found');
                            socket.emit('usersNotFound', {});
                            return;
                        }

                        rooms[message.room] = {isPublic: message.isPublic, users: []};

                        for(var i = 0; i < usersToConnect.length; i++) {
                            addUserToRoom(users[usersToConnect[i]].socket, message.room);
                        }


                        addUserToRoom(socket, message.room);
                        io.to(message.room).emit('roomCreated', {room: message.room, users: rooms[message.room].users, rooms: Object.keys(rooms)});
                    } else {
                        if(!~rooms[message.room].users.indexOf(socket.id)) {
                            addUserToRoom(socket, message.room);
                            socket.broadcast.to(message.room).emit('userJoined', {room: message.room, user: socket.id});
                        }
                    }
                });

                socket.on("message", function (message) {
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