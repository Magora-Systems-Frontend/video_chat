function login () {
	// jshint latedef: false
	'use strict';

	// Login view, /manage/login
	// No logic here, only dependencies declaration and the view itself.
	// For the form, see form/

	angular
		.module('rotimatic.manage.login', [
			'ngRoute',
			'rotimatic.manage.login.form'
		])
		.config([
			'$routeProvider',
			routeProviderConfig
		]);

	function routeProviderConfig($routeProvider) {
		$routeProvider.when('/manage/login', {
			templateUrl: '/manage/login/login.html'
		});
	}

}
