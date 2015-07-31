(function () {

    'use strict';

    //********************CORE*************************************

    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var bcrypt = require('')

    var argv = require('minimist')(process.argv.slice(2));
    app.set('env', argv.p ? 'prod' : 'dev');

    //********************CONFIG***********************************

    var configApp = require('./config/index.js');
    configApp.init(app.get('env'));
    app.set('config', configApp.config);


    if (app.get('config').cors) {
        app.use(function (req, res, next) {
            var cors = req.app.get('config').cors;
            Object.keys(cors).forEach(function (key) {
                res.header(key, cors[key]);
            });

            next();
        });
    }

    //*************************DB**********************************
    var db = require('./api/services/mongooseManage.js');
    db.init(configApp.config.mongodb);


    //********************PASSPORT*********************************

    var passport = require('passport');

    var tokens = {};

    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password'
    }, function(username, password, next) {
        User
            .findOne()
            .where({
                or: [{
                    userName: username
                }, {
                    email: username
                }]
            })
            .done(function(error, user) {
                //Сигнатура next-callback'а:
                //next(error, user, info);
                if (error) {
                    next(error);
                } else if (!user) {
                    next(false, false, 'This user not exists');
                } else if (!bcrypt.compareSync(password, user.password)) {
                    next(false, false, 'Wrong password');
                } else {
                    next(false, user);
                }
            });
    }));

    var User = require('../models/User.js');
    passport.use(new RememberMeStrategy(
        function(token, done) {
            consumeRememberMeToken(token, function(err, uid) {
                if (err) { return done(err); }
                if (!uid) { return done(null, false); }

                findById(uid, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    return done(null, user);
                });
            });
        },
        issueToken
    ));

    function issueToken(user, done) {
        var token = utils.randomString(64);
        saveRememberMeToken(token, user.id, function(err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    }


    function consumeRememberMeToken(token, fn) {
        var uid = tokens[token];
        // invalidate the single-use token
        delete tokens[token];
        return fn(null, uid);
    }

    function saveRememberMeToken(token, uid, fn) {
        tokens[token] = uid;
        return fn();
    }


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err,user){
            err
                ? done(err)
                : done(null,user);
        });
    });

    app.use(passport.initialize());

    //********************ROUTING**********************************

    require('./api/services/route.js')(configApp.config, app);
    require('./api/services/socketService.js')(http);
    //io.on('connection', function(socket){
    //    console.log('a user connected');
    //    socket.on('disconnect', function(){
    //        console.log('user disconnected');
    //    });
    //});

    http.listen(configApp.config.server.port);

    console.log('Server running on ' + configApp.config.server.port + ' port, env "' + app.get('env') + '"');
})();