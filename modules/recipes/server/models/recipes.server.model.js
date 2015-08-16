'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Recipes Schema
 */

var RecipesSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	url: {
		type: String,
		default: '',
		trim: true
	},
	rspan:{
		type: Number,
		default: 1
	},
	cspan:{
		type: Number,
		default: 1
	},
	content1: {
		type: String,
		default: '',
		trim: true
	},
	content2: {
		type: String,
		default: '',
		trim: true
	},
	content3: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Recipes', RecipesSchema);
