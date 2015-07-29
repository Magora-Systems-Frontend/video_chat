(function (angular) {

    'use strict';

    //

    angular
        .module('videoChat.api.users', [
            'videoChat.api',
            'videoChat.api.message'
        ])
        .factory('apiUserFactory', apiUserFactory);

    apiUserFactory.$inject = ['apiSocketFactory'];

    function apiUserFactory(apiSocketFactory) {
        var defaults = {};
        var endpoints = {};
        var actions = {};
        //var users = $resource(apiUrl, defaults, actions);

        var factory = {
            // TODO:: replace dummy stuff with actual methods
            list: [
                {id: '18835291610', fullname: "user 1", email: 'qweqwe@mail.com'},
                {id: '12828461112', fullname: "user 2", email: 'pekpek@pek.pek'},
                {id: '10480980811', fullname: "user 3", email: 'pew-pew@gmail.com'},
                {id: '10984828213', fullname: "user 4", email: 'username@mail.net'},
                {id: '18817755514', fullname: "user 5", email: 'meep.meep.meep@meeeeeep.org'},
                {id: '14700054515', fullname: "user 6", email: 'some.really.long.one@some.internet.mail.service.com'},
                {id: '11010001116', fullname: "user 7", email: '0010010@010111.biz'}
            ],
            loadContactList: function () {

            }
        };

        return factory;
    }

})(angular);
