(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var messageSchema = new Schema({
        text: {type: String, required: true},
        sender: {type: String, required: true},
        room: {type: String, required: true},
        type: {type: String, required: true},
        //listenerId: {type: Number, required: true},
        //whoIsRead: {
        //    id: {type: Number}
        //},
        date: {type: Date, required: true, default: Date.now() }
    });

    /**
     *
     * @param senderId - userId or roomId
     * @param senderType - room/user
     * @returns {Query}
     */
    messageSchema.methods.getMessagesBySenderId = function(senderId, senderType){
        return Message.find({sender: senderId, type: senderType})
    };
    /**
     *
     * @param objMessage as {text: , senderId: ,senderType: ,listenerId: ,whoIsRead: ,date: }
     * @param cb - callback(error, Message)
     */
    messageSchema.methods.addMessage = function(objMessage, cb){
       var message = new Message(objMessage);
        message.save(cb);
    };

    /**
     *
     * @param queryMessage
     * @param newFieldsMessage have many fields as {text: , senderId: ,senderType: ,listenerId: ,whoIsRead: ,date: }
     * @param cb - callback(error, Message)
     */
    messageSchema.methods.updateUserMessage = function(queryMessage, newFieldsMessage, cb){
        Message.findOneAndUpdate(queryMessage, newFieldsMessage, cb);
    };

    var Message = mongoose.model('Message', messageSchema);

    module.exports = Message;
})();