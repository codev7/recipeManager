'use strict';

//Recipes service used for communicating with the recipes REST endpoints
angular.module('recipes').factory('Recipes', ['$resource',
	function($resource) {
		return $resource('api/recipes/:recipeId', {
			recipeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

	}
]);
