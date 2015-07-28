(function () {

    'use strict';

    var mongoose = require('mongoose');

    function init(config) {
        connect(config);
        mongoose.connection.on('error', console.log);
        mongoose.connection.on('disconnected', connect);
    }

    function connect(config) {
        mongoose.connect('mongodb://' + config.host + '/' + config.database, config.options);
    }

    module.exports = {
        init: init,
        connect: connect
    }
})();