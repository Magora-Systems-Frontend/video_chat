(function () {

    'use strict';

    var validator = require('validator'),
        passport = require("passport"),
        User = require('../models/User.js'),
        Token = require('../models/Token.js'),
        configApp = require('../../config/index.js'),
        config = configApp.config,
        errors = config.errors;


    var authController = {
        actionIndex: index,
        actionLogin: login,
        actionLogout: logout,
        actionRegister: register
    };

    /*function _ensureAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) { 
            return res.status(errors.auth.restricted.status).json(errors.auth.restricted.response);
        }
        return next(); 
    }*/

    function index(req, res) {
        res.json(['ok']);
    }

    function login(req, res) {

        doAuth(req, res);

    }

    function logout(req, res) {
        req.logout();
        return res.status(errors.auth.invalid.status).json(errors.auth.invalid.response);
    }

    function register(req, res){

        var username = req.body.name,
            password = req.body.password,
            email = req.body.email;

        var user = new User({
            name: username,
            password: password,
            email: email
        });

        user.save(function(err, user) {

            if(err) {
                console.log(err);
                return res.status(errors.auth.invalid.status).json(errors.auth.invalid.response);
            }
            doAuth(req, res);

        });
    }

    function doAuth(req, res){
        passport.authenticate('local',
            function (err, user, info) {
                if (err) {
                    return res.status(errors.auth.invalid.status).json(errors.auth.invalid.response);
                } else if (info && !info.key) {
                    return res.status(errors.auth.restricted.status).json(errors.auth.restricted.response);
                } else {
                    req.login(user, function(err) {
                        if (err) {
                            return res.status(errors.auth.invalid.status).json(errors.auth.invalid.response);
                        } else {
                            return res.json({token: info.key, expire: info.expiresAt});
                        }
                    });
                }

            }
        )(req, res);
    }

    module.exports = authController;
})();
