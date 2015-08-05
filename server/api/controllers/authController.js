(function () {

    'use strict';

    var passport = require("passport");

    var User = require('../models/User.js');


    var authController = {
        actionIndex: index,
        actionLogin: login,
        actionLogout: logout,
        actionRegister: register
    };

    function _ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }

    function index(req, res) {
        res.json(['ok']);
    }

    function login(req, res) {
        var login  = req.body.login;
        var password = req.body.password;

        passport.authenticate('local',
            function (err, user, info) {
                if(err)
                    res.redirect('login');
                res.redirect('/');
            }
        )(req, res);
    }

    function logout(req, res) {
        req.logout();
        res.redirect('/');
    }

    function register(req, cb){

        var user = new User({
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email
        });

        user.save(function(err) {
            if(err) {
                console.log(err);
                return;
            }

            return cb();
        });
    }

    module.exports = authController;
})();
