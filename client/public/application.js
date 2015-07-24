(function (angular) {
    'use strict';

    angular
        .module('VideoChat', [
            'ui.router',
            'videoChat.chat',
            'videoChat.contactList'
        ])
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$locationProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $locationProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('homepage', {
                url: '/',
                templateUrl: 'videoChat/videoChat.html'
            });
    }
})(angular);
(function (angular) {

    'use strict';

    angular
        .module('videoChat.chat', [
            'ui.router',
            'videoChat.chat.text',
            'videoChat.chat.video'
        ]).config(config);

    config.$inject = [
        '$stateProvider'
    ];

    function config($stateProvider) {

        $stateProvider
            .state('homepage.chat', {
                url: ':type/:roomId',
                templateUrl: 'videoChat/chat/chat.html'
            });
    }

})(angular);
(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList', [
            'ui.router',
            'videoChat.contactList.room',
            'videoChat.contactList.user'
        ])
        .directive('vcContactList', contactListDirective);

    contactListDirective.$inject = ['$state'];

    function contactListDirective($state) {
        return {
            restrict: 'E',
            scope: {
                type: '='
            },
            bindToController: true,
            controller: contactListController,
            controllerAs: 'contactListCtrl',
            templateUrl: 'videoChat/contactList/contactList.html'
        };

        function contactListController() {
            var contactList = this;

            contactList.type = $state.type || 'user';

            console.log('contactList init');
        }
    }

})(angular);
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

(function (angular) {

    'use strict';

    angular
        .module('videoChat.api.room', [
            'ngResource'
        ])
        .factory('apiRoomFactory', [
            '$resource',
            apiRoomFactory
        ]);

    apiRoomFactory.$inject = ['$resource'];

    function apiRoomFactory($resource) {
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

(function (angular) {

    'use strict';

    angular
        .module('videoChat.api.users', [
            'videoChat.api.message',
            'ngResource'
        ])
        .factory('apiUserFactory', apiUserFactory);

    apiUserFactory.$inject = ['$resource'];

    function apiUserFactory($resource) {
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

(function (angular) {

    'use strict';

    angular
        .module('videoChat.chat.text', [])
        .directive('vcText', textDirective);


    function textDirective() {

        textController.$inject = ['$state', 'apiMessageFactory'];

        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: textController,
            controllerAs: 'textCtrl',
            templateUrl: 'videoChat/chat/text/text.html'
        };

        function textController($state, apiMessageFactory) {
            var textCtrl = this;
            textCtrl.roomId = $state.params.roomId;

            apiMessageFactory.loadMessagesByUser('currentUserId', textCtrl.roomId);
            textCtrl.list = apiMessageFactory.list;


        }
    }

})(angular);
(function (angular) {

    'use strict';

    angular
        .module('videoChat.chat.video', [
            'ui.router'
        ])
        .directive('vcVideo', [
            videoDirective
        ]);

    function videoDirective() {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: videoController,
            controllerAs: 'videoCtrl',
            templateUrl: 'videoChat/chat/video/video.html'
        };

        function videoController() {
            var video = this;

            console.log('video init');
        }
    }

})(angular);
(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList.contact', [
            'ui.router'
        ])
        .directive('vcContact', contactDirective);

    function contactDirective() {
        return {
            restrict: 'E',
            scope: {
                type: '@',
                name: '=',
                id: '=',
                hasStatus: '='
            },
            templateUrl: 'videoChat/contactList/contact/contact.html'
        };
    }

})(angular);
(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList.room', [
            'ui.router',
            'videoChat.api.room',
            'videoChat.contactList.contact'
        ])
        .directive('vcRoom', roomDirective);


    roomDirective.$inject = ['apiRoomFactory'];

    function roomDirective(apiRoomFactory) {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: roomController,
            controllerAs: 'roomCtrl',
            templateUrl: 'videoChat/contactList/room/room.html'
        };

        function roomController() {
            var roomCtrl = this;

            roomCtrl.list = apiRoomFactory.list;

            console.log('room opened');
        }
    }
})(angular);
(function (angular) {

    'use strict';

    angular
        .module('videoChat.contactList.user', [
            'videoChat.api.users',
            'videoChat.contactList.contact',
            'ui.router'
        ])
        .directive('vcUser', userDirective);

    userDirective.$inject = ['apiUserFactory'];

    function userDirective(apiUserFactory) {
        return {
            restrict: 'E',
            scope: false,
            bindToController: true,
            controller: userController,
            controllerAs: 'userCtrl',
            templateUrl: 'videoChat/contactList/user/user.html'
        };

        function userController() {
            var userCtrl = this;

            userCtrl.list = apiUserFactory.list;

            console.log('user init');
        }
    }

})(angular);