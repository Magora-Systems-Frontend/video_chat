(function () {

    'use strict';

    var mongoose = require('mongoose'),
        bcrypt = require('bcryptjs'),
        Schema = mongoose.Schema,
        userSchema = new Schema({
            name: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            email: { type: String, required: true, unique: true }
        });

    userSchema.methods = {
        create: create,
        getById: getById,
        update: update,
        remove: remove
    };

    userSchema.statics = {
        checkPassword: checkPassword,
        findUnique: findUnique,
        list: list
    };

    userSchema.pre('save', function(next) {
        var user = this;

        if (!user.isModified('password')){
            return next();
        }

        bcrypt.genSalt(8, function(err, salt) {
            if (err){
                return next(err);
            } 

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err){
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    });

    function checkPassword(password, userPassword, cb) {
        bcrypt.compare(password, userPassword, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    function create(user, cb){
        var user = new User(user);
        user.save(cb);
    }

    function getById(userId, cb){
        return User.find({id: userId}, cb)
    }

    function findUnique(userName, email, cb){
        return User.findOne({ $and: {name: userName, email: email}});
    }

    function list(query, cb){
        var queryObj = query || {};
        User.aggregate({$match: queryObj}, 
        { $sort: {_id: -1} },
        {
            $project: {
                _id: 0,
                id: '$_id',
                name: 1,
                email: 1
            }
        }, 
        function(err, users){
            console.log('LIST USERS ----->', err, users);
            if(err){
                cb(err, null);
            }
            cb(null, users);
        });
    }

    function update(user){

    }

    function remove(userId){

    }

    var User = mongoose.model('User', userSchema);

    module.exports = User;
})();