(function (angular) {

    'use strict';

    angular
        .module('videoChat.api.room', [
            'videoChat.api'
        ])
        .factory('apiRoomFactory',apiRoomFactory);

    apiRoomFactory.$inject = ['apiSocketFactory'];

    function apiRoomFactory(apiSocketFactory) {
        var defaults = {};
        var endpoints = {};
        var actions = {};

        var factory = {
            list: [
                {id: '1883529160000', name: "room 1"},
                {id: '1282846110000', name: "room 2"},
                {id: '1048098080000', name: "room 3"},
                {id: '1098482820000', name: "room 4"},
                {id: '1881775550000', name: "room 5"},
                {id: '1470005450000', name: "room 6"},
                {id: '1101000110000', name: "room 7"}
            ]
        };

        return factory;
    }

})(angular);
