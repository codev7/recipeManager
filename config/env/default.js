'use strict';


module.exports = {
	app: {
		title: 'Recipes',
		description: 'Recipes Management using Angular Material',
		keywords: 'MongoDB, Express, AngularJS,Angular Material, Node.js',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions'
};
