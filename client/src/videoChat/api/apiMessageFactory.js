(function (angular) {

    'use strict';

    angular
        .module('videoChat.api.message', [
            'ngResource'
        ])
        .factory('apiMessageFactory', apiMessageFactory);

    apiMessageFactory.$inject = ['$resource'];

    function apiMessageFactory($resource) {
        var defaults = {};
        var endpoints = {};
        var actions = {};

        //$resource(apiUrl, defaults, actions)

        var factory = {
            list: [
                {
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
                }, {
                    sender: {
                        id: '10480980811',
                        name: 'user 3'
                    },
                    messageId: '123321',
                    whoIsRead: [{
                        name: 'user 3',
                        id: '2342342234'
                    }],
                    message: 'message 2 from user 3',
                    date: ''
                }, {
                    sender:{
                        id: '12828461112',
                        name: 'user 1'
                    },
                    messageId: '2342342234',
                    whoIsRead: [{
                        name: 'user 1',
                        id: '12828461112'
                    }],
                    message: 'message 3 from user 1',
                    date: '08.08.2005'
                }, {
                    sender: {
                        id: '10480980811',
                        name: 'user 3'
                    },
                    messageId: '123321',
                    whoIsRead: [{
                        name: 'user 3',
                        id: '2342342234'
                    }],
                    message: 'message 4 from user 3',
                    date: ''
                }
            ],
            loadMessagesByUser: function (toId, fromId) {

            }
        };

        return factory;
    }

})(angular);
