var Backbone = require('backbone'),
	_         = require('underscore'),
	$         = require('jquery'),
	assert = require('chai').assert,
	sinon = require('sinon'),
	BoardCollection = require('../libs/BoardCollection.js');

suite('Test board', function() {
	setup(function() {
		this.sandbox = sinon.sandbox.create();
		this.boardCollection = new BoardCollection();
	});
	teardown(function() {
		this.sandbox.restore();
	});

	test('sandbbox test', function() {
		assert.isNotNull($('#sandbox'));
	});
});