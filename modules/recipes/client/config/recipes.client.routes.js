'use strict';

// Setting up route
angular.module('recipes').config(['$stateProvider',
	function($stateProvider) {
		// recipes state routing
		$stateProvider.
		state('recipes', {
			abstract: true,
			url: '/recipes',
			template: '<ui-view/>'
		}).
		state('recipes.list', {
			url: '',
			templateUrl: 'modules/recipes/views/list-recipes.client.view.html'
		}).
		state('recipes.create', {
			url: '/create',
			templateUrl: 'modules/recipes/views/create-recipe.client.view.html'
		}).
		state('recipes.view', {
			url: '/:recipeId',
			templateUrl: 'modules/recipes/views/view-recipe.client.view.html'
		}).
		state('recipes.edit', {
			url: '/:recipeId/edit',
			templateUrl: 'modules/recipes/views/edit-recipe.client.view.html'
		});
	}
]);
