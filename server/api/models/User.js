(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        userName: { type: String, required: true, unique: true },
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
        findUnique: findUnique
    };

    function create(user, cb){
        var user = new User(user);
        user.save(cb);
    }

    function getById(userId, cb){
        return User.find({id: userId}, cb)
    }

    function findUnique(userName, email, cb){
        return User.findOne({ $and: {userName: userName, email: email}});
    }

    function update(user){

    }

    function remove(userId){

    }

    var User = mongoose.model('User', userSchema);

    module.exports = User;
})();