var Backbone = require('backbone'),
	_         = require('underscore'),
	$         = require('jquery'),
	assert = require('chai').assert,
	sinon = require('sinon'),
	GameView = require('../libs/Game.js');
	Backbone.$ = $;

suite('Test game', function() {
	setup(function() {
		this.sandbox = sinon.sandbox.create();
		this.sandbox.spy(GameView.prototype, 'onFieldClick');
		this.game = new GameView({
			el: $('#sandbox')
		});
		validFieldIndexes = function() {
			return []
		}
	});
	teardown(function() {
		this.sandbox.restore();
		this.game.undelegateEvents();
		$('#sandbox').html('');
		delete this.game;
	});

	test('Game instance test', function() {
		assert.isObject(this.game);
	});

	test('board created', function() {
		assert.isObject(this.game.getBoardEl());
	});

	test('has exactly 100 board elements', function() {
		assert.isTrue(this.game.getBoardEl().find('button').length == 100, 'it should be true');
	});

	test('board elements are clickable', function() {
		this.game.getBoardEl().find('button')[0].click();
		assert.isTrue(this.game.onFieldClick.calledOnce);
	});

	test('click counter starts from 1 at the beginning of the game', function() {
		assert.strictEqual(this.game.getCounterState(), 1);
	});

	test('increases counters when clicked', function() {
		var buttonList = $('#game-board').find('button');
		buttonList[0].click();
		assert.strictEqual(this.game.getCounterState(), 2);
		buttonList[1].click();
		assert.strictEqual(this.game.getCounterState(), 3);
	});

	test('clicked field gets marked', function() {
		var field = $(this.game.getBoardEl().find('button')[0]);
		assert.isFalse(field.data('clicked'));
		field.click();
		assert.isTrue(field.data('clicked'));
	});

	test('clicked field cannot be clicked again', function() {
		var field = $(this.game.getBoardEl().find('button')[0]);
		field.click();
		assert.strictEqual(this.game.getCounterState(), 2);
		field.click();
		assert.strictEqual(this.game.getCounterState(), 2);
	});

	test('just valid field are clickable', function() {
		this.game.getBoardEl().find('button')[0].click();
	});
});