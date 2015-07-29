(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true }
    });

    userSchema.methods.getUser = function(user){

    };

    var User = mongoose.model('User', userSchema);

    module.exports = User;
})();