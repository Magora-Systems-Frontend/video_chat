(function () {

    'use strict';

    //********************CORE*************************************

    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var bcrypt = require('bcrypt-nodejs');

    var argv = require('minimist')(process.argv.slice(2));
    app.set('env', argv.p ? 'prod' : 'dev');

    var User = require('./api/models/User.js');
    var Token = require('./api/models/Token.js');

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
                    Token.create({key: _token.getHash(user.userName)});
                    next(false, user);
                }
            });
    }));

    app.use(passport.initialize());

    //********************ROUTING**********************************

    require('./api/services/route.js')(configApp.config, app);
    require('./api/services/socketService.js')(http);

    http.listen(configApp.config.server.port);

    console.log('Server running on ' + configApp.config.server.port + ' port, env "' + app.get('env') + '"');
})();