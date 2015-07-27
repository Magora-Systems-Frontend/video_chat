(function () {

    'use strict';

    var passport = require("passport");
    var User = require('../../database/entities/User.js');



    var authController = {
        actionIndex: index,
        actionLogin: login,
        actionLogout: logout,
        actionRegister: register
    };

    function index(req, res) {
        res.json(['ok']);
    }

    function login(req, res, next) {
        console.log('login');
        passport.authenticate('local',
            function (err, user, info) {

                res.redirect('/');
            }
        )(req, res);
    }

    function logout(req, res, next) {
        req.logout();
        res.redirect('/');
    }

    function register(req, res, next){
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
