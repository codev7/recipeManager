'use strict';

/**
 * Render the main applicaion page
 */

var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Recipes = mongoose.model('Recipes'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.renderIndex = function(req, res) {
	res.render('modules/core/server/views/index', {
		user: req.user || null
	});
};

/**
 * Render the server error page
 */
exports.renderServerError = function(req, res) {
	res.status(500).render('modules/core/server/views/500', {
		error: 'Oops! Something went wrong...'
	});
};

/**
 * Render the server not found page
 */
exports.renderNotFound = function(req, res) {
	res.status(404).render('modules/core/server/views/404', {
		url: req.originalUrl
	});
};

exports.recipelist = function(req, res){
	Recipes.find().sort('-created').populate('user', 'displayName').exec(function(err, recipes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(recipes);
		}
	});
};
