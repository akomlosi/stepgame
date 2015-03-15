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
		this.stepIterationDataProvider = function() {
			return [
				1, 22, 41, 62, 81, 93, 72, 51, 32, 11, 23, 31, 52,
				71, 92, 73, 61, 53, 34, 13, 21, 33, 12, 4, 25, 6,
				14, 2
			];
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

	test('ordered to exactly 10 rows', function() {
		assert.isTrue(this.game.getBoardEl().find('p.row').length == 10);
	});

	test('board elements are clickable', function() {
		this.game.getBoardEl().find('button')[0].click();
		assert.isTrue(this.game.onFieldClick.calledOnce);
	});

	test('click counter starts from 1 in the beginning of the game', function() {
		assert.strictEqual(this.game.getCounterState(), 1);
	});

	test('in the beginning the last clicked element is null', function() {
		assert.isNull(this.game.getLastClickedEl());
	});

	test('can retrieve with the last clicked element', function() {
		var testButton = this.game.getBoardEl().find('button[data-number="10"]');
		testButton.click();
		assert.strictEqual(testButton.attr('data-number'), this.game.getLastClickedEl().attr('data-number'));
		//testButton = $('#game-board').find('button[data-number="29"]');
		//testButton.click();
		//assert.strictEqual(testButton.attr('data-number'), this.game.getLastClickedEl().attr('data-number'));
		//testButton = $('#game-board').find('button[data-number="30"]');
		//testButton.click();
		//assert.strictEqual(this.game.getLastClickedEl().attr('data-number'), 29);
		//var testButton = $('#game-board').find('button[data-number="8"]');
		//testButton.click();
		//assert.strictEqual(testButton.attr('data-number'), this.game.getLastClickedEl().attr('data-number'));
	});

	test('buttons can be selected by data-number value', function() {
		var board = $('#game-board');
		assert.strictEqual(board.find('button[data-number="10"]').length, 1);
		assert.strictEqual(board.find('button[data-number="100"]').length, 1);
		assert.strictEqual(board.find('button[data-number="101"]').length, 0);
	});

	test('increases counters when clicked', function() {
		var buttonList = $('#game-board').find('button');
		assert.strictEqual(this.game.getCounterState(), 1);
		buttonList[0].click();
		assert.strictEqual(this.game.getCounterState(), 2);
	});

	test('clicked field gets marked', function() {
		var field = $(this.game.getBoardEl().find('button')[0]);
		assert.isFalse(field.attr('data-clicked') == 'true');
		field.click();
		assert.isTrue(field.attr('data-clicked') == 'true');
	});

	test('clicked field cannot be clicked again', function() {
		var field = $(this.game.getBoardEl().find('button')[0]);
		field.click();
		assert.strictEqual(this.game.getCounterState(), 2);
		field.click();
		assert.strictEqual(this.game.getCounterState(), 2);
	});

	test('just valid fields are clickable', function() {
		var board = $('#game-board');
		board.find('button[data-number="1"]').click();
		assert.strictEqual(this.game.getCounterState(), 2);
		board.find('button[data-number="2"]').click();
		assert.strictEqual(this.game.getCounterState(), 2);
		board.find('button[data-number="100"]').click();
		assert.strictEqual(this.game.getCounterState(), 2);
		board.find('button[data-number="13"]').click();
		assert.strictEqual(this.game.getCounterState(), 3);
	});

	test('correct step displayed by number', function() {
		var testButton = $('#game-board').find('button[data-number="1"]');
		testButton.click();
		assert.strictEqual(testButton.html(), '1');
	});

	test('game ends if there is no more step', function() {
		var board = $('#game-board'),
			steps = this.stepIterationDataProvider();
		for (var i = 0; i < steps.length; i++) {
			board.find('button[data-number="' + steps[i] + '"]').click();
		}
		assert.isFalse(this.game.isGameInProgress());
	});
});