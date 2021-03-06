(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var tokenSchema = new Schema({
        key: {type: String, required: true},
        userId: {type: String, required: true},
        expiresAt: {
            type: String,
            default: new Date(Date.now() + 30 * 60000)
        }
    });

    tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 30 * 60 });

    tokenSchema.methods = {
        checkTokenByKey: checkTokenByKey,
        create: create,
        update: update,
        remove: remove
    };

    /**
     * check token on expiration date
     * @param token
     * @returns boolean
     * @private
     */
    function _isExpired(token, cb){
        if(+token.expireDate < +new Date()){
            Token.find(token).remove(cb);
            return true;
        }
        return false;
    }

    /**
     *
     * @param tokenKey - token hash
     * @param cb - token hash
     */
    function checkTokenByKey(tokenKey, cb){
        var curToken = Token.find({key: tokenKey});
        if(!curToken)
            cb(false);
        else
            !_isExpired(curTokenm, cb);
    }


    /**
     *
     * @param objToken - {key: , userId: , expireDate: }
     * @param cb - callback(error, Message)
     */
    function create(objToken, cb){
        var token = new Token(objToken);
        token.save(cb);
    }

    /**
     *
     * @param queryToken fields for find token
     * @param newFieldsToken have many fields as {key: , userId: ,expireDate: }
     * @param cb - callback(error, Message)
     */
    function update(queryToken, newFieldsToken, cb){
        Token.findOneAndUpdate(queryToken, newFieldsToken, cb);
    }

    function remove(tokenKey, cb){
        Token.find({ key: tokenKey }).remove(cb);
    }

    var Token = mongoose.model('Token', tokenSchema);

    module.exports = Token;
})();