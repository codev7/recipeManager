'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Recipes = mongoose.model('Recipes'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a recipe
 */
exports.create = function(req, res) {
	var recipe = new Recipes(req.body);
	recipe.user = req.user;

	recipe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(recipe);
		}
	});
};

/**
 * Show the current recipe
 */
exports.read = function(req, res) {
	res.json(req.recipe);
};

/**
 * Update a recipe
 */
exports.update = function(req, res) {
	var recipe = req.recipe;

	recipe.title = req.body.title;
	recipe.content = req.body.content;
	recipe.content1 = req.body.content1;
	recipe.content2 = req.body.content2;
	recipe.content3 = req.body.content3;
	recipe.rspan = req.body.rspan;
	recipe.cspan = req.body.cspan;
	recipe.url = req.body.url;

	recipe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(recipe);
		}
	});
};

/**
 * Delete an recipe
 */
exports.delete = function(req, res) {
	var recipe = req.recipe;

	recipe.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(recipe);
		}
	});
};

/**
 * List of Recipes
 */
exports.list = function(req, res) {
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

/**
 * Recipe middleware
 */
exports.recipeByID = function(req, res, next, id) {
	Recipes.findById(id).populate('user', 'displayName').exec(function(err, recipe) {
		if (err) return next(err);
		if (!recipe) return next(new Error('Failed to load recipe ' + id));
		req.recipe = recipe;
		next();
	});
};

exports.uploadfile = function(req,res){

	var file = req.files.file;
	console.log(file);

	var currentdate = new Date();

	var datetime = currentdate.getFullYear()+''+(currentdate.getMonth()+1)+''+currentdate.getDate()+''+currentdate.getHours()+''+currentdate.getMinutes()+''+currentdate.getSeconds()+'.'+file.extension;

	fs.writeFile('./public/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
		if (uploadError) {
			return res.status(400).send({
				message: 'Error occurred while uploading profile picture'
			});
		} else {
			res.jsonp({
				path:file.path,
				newpath:'uploads/' + req.files.file.name,
				error: 'Ah crap! Something bad happened'
			});
		}
	});


};
