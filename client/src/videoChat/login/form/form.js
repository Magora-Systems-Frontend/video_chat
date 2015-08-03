function form () {
	// jshint latedef: false
	'use strict';

	// The login form, /manage/login

	angular
		.module('rotimatic.manage.login.form', [
			'rotimatic.api.account',
			'rotimatic.session.account',
			'rotimatic.notifications',
			'rotimatic.validation'
		])
		.directive('rmLoginForm', [
			'$location',
			'apiAccountFactory',
			'sessionAccountFactory',
			rmLoginForm
		]);

	function rmLoginForm($location, apiAccountFactory, sessionAccountFactory) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: '/manage/login/form/form.html',
			scope: {},
			bindToController: true,
			controller: LoginFormController,
			controllerAs: 'login'
		};

		function LoginFormController() {
			var login = this;

			// Properties

			login.credentials = {};
			login.notifications = [];

			// Validation rules (see /validation/)
			login.validators = {};

			login.validators.identifier = [{
				message: 'Please enter your username or email',
				rule: function (form, field) { return field.$dirty && field.$invalid; }
			}];

			login.validators.password = [{
				message: 'Please enter your password.',
				rule: function (form, field) { return field.$dirty && field.$invalid; }
			}];

			// Methods

			login.submit = submit;

			// Logic

			// Submit the credentials, wait for an answer from the backend
			function submit() {
				/* // TODO: delete me
				 * var pokpok = {
				 *   username: 'pokpok',
				 *   password: '123123',
				 *   email: 'pok@pok.pok',
				 *   role: 'admin'
				 * };
				 * apiAccountFactory
				 *   .register(pokpok)
				 *   .then(function (response) { console.log('ok', response); })
				 *   .catch(function (response) { console.log('ok', response); });
				 */

				if (login.form.$valid) {
					// Clear the notifications if any
					login.notifications.length = 0;
					// Pass the credentials
					apiAccountFactory
						.login(login.credentials)
						.then(callbackLoginSuccess)
						.catch(callbackLoginFailure);
				}
			}

			// All good, save the session details in local storage,
			// and let the user in.
			function callbackLoginSuccess(response) {
				if(response.admin){
					sessionAccountFactory.setAccountDetails({
						identifier: login.credentials.identifier,
						token: response.token,
						logged: true
					});
					$location.path('/manage');
				} else {
					login.notifications.push({
						type: 'invalid',
						text: 'You have to be administrator.'
					});
				}
			}

			// Nope, didn't work. Show the notification with the problem
			// matter.
			function callbackLoginFailure(response) {
				login.notifications.push({
					type: 'invalid',
					text: 'Could not log in. Please check your credentials and try again.'
				});
				console.log('nope', response);
			}

		}
	}

}
