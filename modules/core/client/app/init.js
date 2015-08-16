'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
//angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
//	function($locationProvider) {
//		$locationProvider.html5Mode(true).hashPrefix('!');
//	}
//]);

angular.module(ApplicationConfiguration.applicationModuleName).config([
	'$locationProvider', '$mdThemingProvider', '$mdIconProvider',
	function($locationProvider, $mdThemingProvider, $mdIconProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');

		$mdThemingProvider.theme('default');

		// Register the user `avatar` icons
		$mdIconProvider
			.defaultIconSet('./assets/svg/avatars.svg', 128)
			.icon('menu'       , './assets/svg/menu.svg'        , 24)
			.icon('more'       , './assets/svg/more.svg'        , 24)
			.icon('share'      , './assets/svg/share.svg'       , 24)
			.icon('google_plus', './assets/svg/google_plus.svg' , 512)
			.icon('hangouts'   , './assets/svg/hangouts.svg'    , 512)
			.icon('twitter'    , './assets/svg/twitter.svg'     , 512)
			.icon('phone'      , './assets/svg/phone.svg'       , 512);
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
