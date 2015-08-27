(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var roomSchema = new Schema({
        name: {type: String, required: true},
        users: {type: Array, required: true},
        createdAt: {type: Date, default: Date.now() }
    });

    var Room = mongoose.model('Room', messageSchema);

    module.exports = Message;
})();