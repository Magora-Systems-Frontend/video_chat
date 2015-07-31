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

    function register(req, res){
        console.log(req.body);

        var user = new User({
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email
        });
        console.log(user);
        user.save(/*function(err) {
            return err
                ? next(err)
                : req.logIn(user, function(err) {
                return err
                    ? next(err)
                    : res.redirect('/private');
            });
        }*/);

        res.json([])
    }

    module.exports = authController;
})();
