'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	'usersService','Recipes', '$mdSidenav', '$mdBottomSheet', '$log',
	function($scope, Authentication, usersService, Recipes, $mdSidenav, $mdBottomSheet, $log) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


		/**
		 * Main Controller for the Angular Material Starter App
		 * @param $scope
		 * @param $mdSidenav
		 * @param avatarsService
		 * @constructor
		 */
		$scope.find = function() {
			$scope.recipes = Recipes.query();
		};

		$scope.initialgrid = function() {
			this.isotope({
				itemSelector: '.grid-item',
				masonry: {
					columnWidth: 100
				}
			});
		};

		usersService
			.loadAll()
			.then( function( recipeitems ) {
				self.recipeitems    = [].concat(recipeitems);
				self.selected = recipeitems[0];
			});

		// *********************************
		// Internal methods
		// *********************************
		/**
		 * Hide or Show the 'left' sideNav area
		 */
		function toggleUsersList() {
			$mdSidenav('left').toggle();
		}
		function toggleUsersMenu() {

		}

		/**
		 * Select the current avatars
		 * @param menuId
		 */
		function selectUser ( recipeitem ) {
			self.selected = angular.isNumber(recipeitem) ? $scope.recipeitems[recipeitem] : recipeitem;
			self.toggleList();
		}

		/**
		 * Show the bottom sheet
		 */
		function share($event) {
			var recipeitem = self.selected;

			/**
			 * Bottom Sheet controller for the Avatar Actions
			 */
			function UserSheetController( $mdBottomSheet ) {
				this.recipeitem = recipeitem;
				this.items = [
					{ name: 'Phone'       , icon: 'phone'       },
					{ name: 'Twitter'     , icon: 'twitter'     },
					{ name: 'Google+'     , icon: 'google_plus' },
					{ name: 'Hangout'     , icon: 'hangouts'    }
				];
				this.performAction = function(action) {
					$mdBottomSheet.hide(action);
				};
			}

			$mdBottomSheet.show({
				parent: angular.element(document.getElementById('contenttext')),
				templateUrl: 'modules/core/views/contactSheet.html',
				controller: [ '$mdBottomSheet', UserSheetController],
				controllerAs: 'vm',
				bindToController : true,
				targetEvent: $event
			}).then(function(clickedItem) {
				$log.debug( clickedItem.name + ' clicked!');
			});
		}


		var self = this;

		self.selected     = null;
		self.recipeitems        = [ ];
		self.selectUser   = selectUser;
		self.toggleList   = toggleUsersList;
        self.toggleMenu   = toggleUsersMenu;
		self.share        = share;

		$scope.flipped = false;

		$scope.flip = function() {
			$scope.flipped = !$scope.flipped;
		};
	}

]);


angular.module('core').directive('flip', function(){

	function setDim(element, width, height){
		element.style.width = width;
		element.style.height = height;
	}

	var cssString =
		'<style> '+'.flip {float: left; overflow: hidden;display:block;position:relative;} '+'.flipBasic { position: absolute; '+
		'-webkit-backface-visibility: hidden; '+
		'backface-visibility: hidden; '+
		'transition: -webkit-transform .5s; '+
		'transition: transform .5s; '+
		'-webkit-transform: perspective( 800px ) rotateY( 0deg ); '+
		'transform: perspective( 800px ) rotateY( 0deg ); '+
		'} '+'.flipHideBack { '+'-webkit-transform:  perspective(800px) rotateY( 180deg ); '+
		'transform:  perspective(800px) rotateY( 180deg ); '+
		'} '+'.flipHideFront { '+'-webkit-transform:  perspective(800px) rotateY( -180deg ); '+
		'transform:  perspective(800px) rotateY( -180deg ); '+
		'} '+'</style> ';

	document.head.insertAdjacentHTML('beforeend', cssString);


	return {
		restrict : 'E',
		controller: function($scope, $element, $attrs){

			var self = this;
			self.front = null;
			self.back = null;


			function showFront(){
				self.front.removeClass('flipHideFront');
				self.back.addClass('flipHideBack');
			}

			function showBack(){
				self.back.removeClass('flipHideBack');
				self.front.addClass('flipHideFront');
			}

			self.init = function(){
				self.front.addClass('flipBasic');
				self.back.addClass('flipBasic');

				showFront();
				self.front.on('click', showBack);
				self.back.on('click', showFront);
			};

		},

		link : function(scope,element,attrs, ctrl){

			var width = attrs.flipWidth || '100%',
				height =  attrs.flipHeight || '100%';

			element.addClass('flip');

			if(ctrl.front && ctrl.back){
				[ctrl.front, ctrl.back].forEach(function(el){
					setDim(el[0], width, height);
				});
				ctrl.init();
			}
			else {
				console.error('FLIP: 2 panels required.');
			}

		}
	};

});

angular.module('core').directive('flipPanel', function(){
	return {
		restrict : 'E',
		require : '^flip',
		//transclusion : true,
		link: function(scope, element, attrs, flipCtr){
			if(!flipCtr.front) {flipCtr.front = element;}
			else if(!flipCtr.back) {flipCtr.back = element;}
			else {
				console.error('FLIP: Too many panels.');
			}
		}
	};
});

