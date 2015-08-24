(function () {

    'use strict';

    var requireDir = require('require-dir');
    var controllers = requireDir('../controllers');

    function configure(config, app) {
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

            app[method](uri, function (req, res, next) {
                controllers[params.controller + 'Controller']['action' + params.action.charAt(0,1).toUpperCase() + params.action.slice(1)](req, res, next);
            });
        });
    }

    module.exports = configure;

})();