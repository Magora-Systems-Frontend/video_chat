(function () {

    'use strict';

    //********************CORE*************************************

    var app = require('express')();
    var server = require('http').Server(app);
    var bcrypt = require('bcrypt-nodejs');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var session      = require('express-session');

    var argv = require('minimist')(process.argv.slice(2));
    app.set('env', argv.p ? 'prod' : 'dev');

    var User = require('./api/models/User.js');
    var Token = require('./api/models/Token.js');

    //********************CONFIG***********************************
    var configApp = require('./config/index.js');
    configApp.init(app.get('env'));
    app.set('config', configApp.config);

    app.use(require('morgan')('combined'));
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
    var _token = (function() {
        var txt =
            'Идет гражданская война. Космические корабли' +
            'повстанцев, наносящие удар с тайной базы,' +
            'одержали первую победу, в схватке' +
            'со зловещей Галактической Империей.' +
            'Во время сражения, разведчикам повстанцев' +
            'удалось похитить секретные планы,' +
            'связанные с главным оружием Империи -' +
            'Звездой Смерти, бронированной космической' +
            'станцией, способной уничтожить целую планету.' +
            'Преследуемая имперскими агентами принцесса' +
            'Лея спешит домой на своем звездном корабле.' +
            'При ней находятся похищенные планы,' +
            'которые могут спасти ее народ' +
            'и вернуть свободу галактике.';

        function compare(login, hash){
            return bcrypt.compareSync((login + txt), hash)
        }

        function getHash(login){
            return bcrypt.hashSync(txt+login);
        }

        return {
            compare: compare,
            getHash: getHash
        }

    })();

    passport.use(new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password'
    }, function(identifier, password, next) {
        User.findOne({$or: [{ name: identifier }, { email: identifier }] }, 
            function(error, user) {
                //Сигнатура next-callback'а:
                //next(error, user, info);
                console.log('found user---->', error, user);
                if (error) {
                    next(error);
                } else if (!user) {
                    next(false, false, 'This user not exists');
                //} else if (!bcrypt.compareSync(password, user.password)) {
                //    next(false, false, 'Wrong password');
                } else {

                    Token.findOne({userId: user._id}, function(err, result){
                        if(result){
                            next(false, user, result);
                        } else {
                            var newToken = new Token({
                                key: _token.getHash(user.name),
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