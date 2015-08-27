(function () {

    'use strict';

    //********************CORE*************************************

    var app = require('express')(),
        server = require('http').Server(app),
        bcrypt = require('bcryptjs'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        session      = require('express-session'),
        User = require('./api/models/User.js'),
        Token = require('./api/models/Token.js'),
        argv = require('minimist')(process.argv.slice(2));
    
    app.set('env', argv.p ? 'prod' : 'dev');

    //********************CONFIG***********************************
    var configApp = require('./config/index.js');
    configApp.init(app.get('env'));
    app.set('config', configApp.config);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


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
        usernameField: 'name',
        passwordField: 'password'
    }, function(identifier, password, next) {
        User.findOne({$or: [{ name: identifier }, { email: identifier }] }, 
            function(err, user) {
                //Сигнатура next-callback'а:
                //next(error, user, info);

                if (err) {
                    next(err);
                } else {
                    User.checkPassword(password, user.password, function(err, isMatch){
                        
                        if(err || !isMatch){
                            next(err);
                        } else {
                            Token.findOne({userId: user._id}, function(err, result){
                                if(result){
                                    next(false, user, result);
                                } else {
                                    var newToken = new Token({
                                        key: bcrypt.hashSync(user.name, 8),
                                        userId: user._id
                                    });

                                    newToken.save(newToken, function(err, token){
                                        if(err){
                                            next(err, null);
                                        } else {
                                            next(false, user, token);
                                        }

                                    });
                                }
                            });
                        }

                    });
                    
                }
            });
    }));

    passport.serializeUser(function(user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
        User.findById(id, function (err, user) {
            if (err) { return cb(err); }
                cb(null, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    //********************ROUTING**********************************

    require('./api/services/route.js')(configApp.config, app);

    //app.listen(configApp.config.server.port);
    server.listen(configApp.config.server.port);


    require('./api/services/socketService.js')(server);

    console.log('Server running on ' + configApp.config.server.port + ' port, env "' + app.get('env') + '"');
})();