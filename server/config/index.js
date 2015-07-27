(function(){

    'use strict';

    var merge = require('deepmerge');
    var requireDir = require('require-dir');


    var configs = requireDir('./') || {};
    var config = {};

    function init(env){
        for (var key in configs) {
            if (configs.hasOwnProperty(key)) {
                if (configs[key][env]) {
                    config[key] = merge(configs[key]['default'], configs[key][env])
                } else {
                    config[key] = configs[key]['default']
                }
            }
        }
    }

    module.exports = {
        init: init,
        config: config
    };
})();