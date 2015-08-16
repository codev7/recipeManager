'use strict';

/**
 * Module dependencies.
 */
var recipesPolicy = require('../policies/recipes.server.policy'),
	recipes = require('../controllers/recipes.server.controller');

module.exports = function(app) {
	// recipes collection routes
	app.route('/api/recipes').all(recipesPolicy.isAllowed)
		.get(recipes.list)
		.post(recipes.create);

	// Single recipe routes
	app.route('/api/recipes/:recipeId').all(recipesPolicy.isAllowed)
		.get(recipes.read)
		.put(recipes.update)
		.delete(recipes.delete);

	// Finish by binding the recipe middleware
	app.param('recipeId', recipes.recipeByID);


	app.route('/uploads').post(recipes.uploadfile);
};
