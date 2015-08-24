(function () {

    'use strict';

    var passport = require("passport"),
        User = require('../models/User.js'),
        configApp = require('../../config/index.js'),
        config = configApp.config,
        errors = config.errors;


    var authController = {
        actionIndex: index,
        actionLogin: login,
        actionLogout: logout,
        actionRegister: register
    };

    function _ensureAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) { 
            return res.status(errors.auth.restricted.status).json(errors.auth.restricted.response);
        }
        return next(); 
    }

    function index(req, res) {
        res.json(['ok']);
    }

    function login(req, res) {
        var login  = req.body.login;
        var password = req.body.password;

        passport.authenticate('local',
            function (err, user, info) {
                console.log(err, user, info);
                if(err){
                    return res.status(errors.auth.invalid.status).json(errors.auth.invalid.response);
                }
                return res.json(user);
            }
        )(req, res);
    }

    function logout(req, res) {
        req.logout();
        res.redirect('/');
    }

    function register(req, res, cb){

        var name = req.body.name,
            password = req.body.password,
            email = req.body.email;

        var user = new User({
            name: name,
            password: password,
            email: email
        });

        user.save(function(err, user) {

            if(err) {
                return res.status(errors.auth.invalid.status).json(errors.auth.invalid.response);
            }

            return cb();
        });
    }

    module.exports = authController;
})();
