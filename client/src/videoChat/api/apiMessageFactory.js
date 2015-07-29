(function (angular) {

    'use strict';

    angular
        .module('videoChat.api.message', [
            'videoChat.api'
        ])
        .factory('apiMessageFactory', apiMessageFactory);

    apiMessageFactory.$inject = ['apiSocketFactory'];

    function apiMessageFactory(apiSocket) {

        /*
        *                 {
         sender:{
         id: '12828461112',
         name: 'user 1'
         },
         messageId: '2342342234',
         whoIsRead: [{
         name: 'user 1',
         id: '12828461112'
         }],
         message: 'message 1 from user 1',
         date: '08.08.2005'
         }
        * */

        var factory = {
            list: [],

            loadMessagesByUser: function (toId, fromId) {
                apiSocket.emit('getMessages', function(resp){
                    factory.list = resp;
                })
            }
        };

        return factory;
    }

})(angular);
