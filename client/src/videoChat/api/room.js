(function (angular) {

    'use strict';

    angular
        .module('videoChat.api.rooms', [
            'ngResource'
        ])
        .factory('apiRoomsFactory', [
            '$resource',
            apiRoomsFactory
        ]);

    apiRoomsFactory.$inject = ['$resource'];

    function apiRoomsFactory($resource) {
        var defaults = {};
        var endpoints = {};
        var actions = {};

        var factory = {
            list: [
                { id: '88352916', name: "room 1" },
                { id: '28284611', name: "room 2" },
                { id: '04809808', name: "room 3" },
                { id: '09848282', name: "room 4" },
                { id: '88177555', name: "room 5" },
                { id: '47000545', name: "room 6" },
                { id: '10100011', name: "room 7" }
            ]
        };

        return factory;
    }

})(angular);
