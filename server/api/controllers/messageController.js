(function () {

    'use strict';

    var passport = require("passport"),
        User = require('../models/User.js'),
        configApp = require('../../config/index.js'),
        config = configApp.config,
        errors = config.errors;

    function _ensureAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) { 
            return res.status(errors.auth.restricted.status).json(errors.auth.restricted.response);
        }
        return next(); 
    }

    var messageController = {
        actionGetUserMessages: getUserMessages
    };

    function getUserMessages(req, res, next) {
        if (!req.isAuthenticated()) { 
            return res.status(errors.auth.restricted.status).json(errors.auth.restricted.response);
        }

        return res.json(
        [
        {
            sender:{
                id: '12828461112',
                name: 'user 1'
            },
            messageId: '2342342234',
            whoIsRead: [{
                name: 'user 1',
                id: '12828461112'
            }],
            message: 'message 1 from user 1',
            date: '08.08.2005'
        }, {
            sender: {
                id: '10480980811',
                name: 'user 3'
            },
            messageId: '123321',
            whoIsRead: [{
                name: 'user 3',
                id: '2342342234'
            }],
            message: 'message 2 from user 3',
            date: ''
        }, {
            sender:{
                id: '12828461112',
                name: 'user 1'
            },
            messageId: '2342342234',
            whoIsRead: [{
                name: 'user 1',
                id: '12828461112'
            }],
            message: 'message 3 from user 1',
            date: '08.08.2005'
        }, {
            sender: {
                id: '10480980811',
                name: 'user 3'
            },
            messageId: '123321',
            whoIsRead: [{
                name: 'user 3',
                id: '2342342234'
            }],
            message: 'message 4 from user 3',
            date: ''
        }]);
    }

    module.exports = messageController;
})();
