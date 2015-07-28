(function () {

    'use strict';

    //********************CORE*************************************

    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);


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
    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            return err
                ? done(err)
                : user
                ? password === user.password
                ? done(null, user)
                : done(null, false, {message: 'Incorrect password.'})
                : done(null, false, {message: 'Incorrect username.'});
        });
    }));

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

    //require('./api/services/route.js')(configApp.config, app);

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });

    http.listen(configApp.config.server.port);

    console.log('Server running on ' + configApp.config.server.port + ' port, env "' + app.get('env') + '"');
})();