(function () {

    'use strict';

    var requireDir = require('require-dir');
    var controllers = requireDir('../controllers');
    var http, io;

    //var connections = function(){
    //
    //    var sockets = [];
    //
    //    io.on('connection', function(socket){
    //        socket.on();
    //        sockets.push(socket);
    //
    //    });
    //};

    function configure(config, app) {
        http = require('http').Server(app);
        io = require('socket.io')(http);
        Object.keys(config.route).forEach(function (pattern) {
            var params = config.route[pattern],
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

            var bodyParser = require('body-parser');
            app.use(bodyParser.json());

            app[method](uri, function (req, res, next) {
                controllers[params.controller + 'Controller']['action' + params.action](req, res, next)
            });
        });
    }

    module.exports = configure;

})();