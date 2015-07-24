(function () {
    'use strict';

    var requireDir = require('require-dir'),
        express = require('express'),
        merge = require('deepmerge'),
        argv = require('minimist')(process.argv.slice(2)),
        mongoose = require('mongoose'),
        configs = requireDir('./config') || {},
        appConfig = {},
        app = express();

    app.set('env', argv.p ? 'prod' : 'dev');

    for (var key in configs) {
        if (configs.hasOwnProperty(key)) {
            if (configs[key][app.get('env')]) {
                appConfig[key] = merge(configs[key]['default'], configs[key][app.get('env')])
            } else {
                appConfig[key] = configs[key]['default']
            }
        }
    }

    app.set('config', appConfig);

    function mongoConnect() {
        mongoose.connect('mongodb://' + appConfig.mongodb.host + '/' + appConfig.mongodb.database, appConfig.mongodb.options)
    }

    mongoConnect();

    var models = requireDir('./models');

    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', mongoConnect);

    app.use(function (req, res, next) {

        var cors = req.app.get('config').cors;

        Object.keys(cors).forEach(function (key) {
            res.header(key, cors[key]);
        });

        next();
    });


    var controllers = requireDir('./controllers');

    Object.keys(appConfig.route).forEach(function (pattern) {
        var params = appConfig.route[pattern],
            method,
            uri;

        pattern = pattern.split(' ');

        if (pattern.length > 1) {
            method = pattern[0].toLowerCase();
            uri = pattern[1];
        }
        else {
            uri = pattern[0];
            method = 'all';
        }

        app[method](uri, function (req, res) {
            if (!params.politics
                && controllers[params.controller + 'Controller']
                && controllers[params.controller + 'Controller']['action' + params.action]
            ) {
                controllers[params.controller + 'Controller']['action' + params.action](req, res)
            }
        });
    });

    app.listen(appConfig.server.port);
    console.log('Server running on ' + appConfig.server.port + ' port, env "' + app.get('env') + '"');


})();