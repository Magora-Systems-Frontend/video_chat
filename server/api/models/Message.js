(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var messageSchema = new Schema({
        text: {type: "String", required: true},
        senderId: {type: "Integer", required: true},
        senderType: {type: "String", required: true},
        listenerId: {type: "Integer", required: true},
        whoIsRead: {
            id: {type: "Integer"}
        },
        date: {type: "Date", required: true, default: Date.now }
    });

    /**
     *
     * @param senderId - userId or roomId
     * @param senderType - room/user
     * @returns {Query}
     */
    messageSchema.methods.getMessagesBySenderId = function(senderId, senderType){
        return this.model('Message').find({senderId: senderId, senderType: senderType})
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