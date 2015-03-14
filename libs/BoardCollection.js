var Backbone = require('backbone'),
	BoardModel = require('./BoardModel');
module.exports = Backbone.Collection.extend({
	model : BoardModel
});