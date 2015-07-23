(function (angular) {

    'use strict';

    angular
        .module('videoChat.api.users', [
            'ngResource'
        ])
        .factory('apiUsersFactory', apiUsersFactory);

    apiUsersFactory.$inject = ['$resource'];

    function apiUsersFactory($resource) {
        var defaults = {};
        var endpoints = {};
        var actions = {};
        //var users = $resource(apiUrl, defaults, actions);

        var factory = {
            // TODO:: replace dummy stuff with actual methods
            list: [
                { id: '88352916', fullname: "user 1", email: 'qweqwe@mail.com' },
                { id: '28284611', fullname: "user 2", email: 'pekpek@pek.pek' },
                { id: '04809808', fullname: "user 3", email: 'pew-pew@gmail.com' },
                { id: '09848282', fullname: "user 4", email: 'username@mail.net' },
                { id: '88177555', fullname: "user 5", email: 'meep.meep.meep@meeeeeep.org' },
                { id: '47000545', fullname: "user 6", email: 'some.really.long.one@some.internet.mail.service.com'},
                { id: '10100011', fullname: "user 7", email: '0010010@010111.biz' }
            ]
        };

        return factory;
    }

})(angular);
