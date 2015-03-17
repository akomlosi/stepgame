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
		this.clock = sinon.useFakeTimers();
		this.game = new GameView({
			el: $('#sandbox')
		});
		this.stepIterationDataProvider = function() {
			return [ 12, 33, 14, 22, 34, 13, 1 ];
		};

		this.gameBoard = $('#game-board');

		this.getTestButton = function(num) {
			return this.gameBoard.find('button[data-number="' + num + '"]');
		};

		this.clickTestButton = function(num) {
			var testButton = this.getTestButton(num);
			testButton.click();
			return testButton;
		}
	});
	teardown(function() {
		this.sandbox.restore();
		this.game.undelegateEvents();
		$('#sandbox').html('');
		delete this.game;
		this.clock.restore();
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
		this.clickTestButton(1);
		assert.isTrue(this.game.onFieldClick.calledOnce);
	});

	test('click counter starts from 1 in the beginning of the game', function() {
		assert.strictEqual(this.game.getCounterState(), 1);
	});

	test('in the beginning the last clicked element is null', function() {
		assert.isNull(this.game.getLastClickedEl());
	});

	test('can retrieve with the last clicked element', function() {
		var testButton = this.clickTestButton(10);
		assert.strictEqual(testButton.attr('data-number'), this.game.getLastClickedEl().attr('data-number'));
	});

	test('buttons can be selected by data-number value', function() {
		assert.strictEqual(this.getTestButton(10).length, 1);
		assert.strictEqual(this.getTestButton(100).length, 1);
		assert.strictEqual(this.getTestButton(101).length, 0);
	});

	test('increases counters when clicked', function() {
		assert.strictEqual(this.game.getCounterState(), 1);
		this.getTestButton(1).click();
		assert.strictEqual(this.game.getCounterState(), 2);
	});

	test('clicked field gets marked', function() {
		var field = this.getTestButton(1);
		assert.isFalse(field.attr('data-clicked') == 'true');
		field.click();
		assert.isTrue(field.attr('data-clicked') == 'true');
	});

	test('clicked field cannot be clicked again', function() {
		this.clickTestButton(1);
		assert.strictEqual(this.game.getCounterState(), 2);
		this.clickTestButton(1);
		assert.strictEqual(this.game.getCounterState(), 2);
	});

	test('just valid fields are clickable', function() {
		this.clickTestButton(1);
		assert.strictEqual(this.game.getCounterState(), 2);
		this.clickTestButton(2);
		assert.strictEqual(this.game.getCounterState(), 2);
		this.clickTestButton(100);
		assert.strictEqual(this.game.getCounterState(), 2);
		this.clickTestButton(13);
		assert.strictEqual(this.game.getCounterState(), 3);
	});

	test('correct step displayed by number', function() {
		var testButton = this.clickTestButton(1);
		assert.strictEqual(testButton.html(), '1');
	});

	test('last step marked as current field', function() {
		var testButton1 = this.clickTestButton(1);
		assert.isTrue(testButton1.hasClass('active'));
		var testButton2 = this.clickTestButton(13);
		assert.isFalse(testButton1.hasClass('active'));
		assert.isTrue(testButton2.hasClass('active'));
	});

	test('game ends if there is no more step', function() {
		var steps = this.stepIterationDataProvider(), len = steps.length;
		for (var i = 0; i < len; i++) {
			this.clickTestButton(steps[i]);
		}
		assert.isFalse(this.game.isGameInProgress());
	});

	test('game ends after 60 seconds from the first click', function() {
		this.clickTestButton(1);
		assert.isTrue(this.game.isGameInProgress());
		this.clock.tick(60 * 1000);
		assert.isFalse(this.game.isGameInProgress());
	});

	test('after timeout the board becomes inactive', function() {
		this.clickTestButton(1);
		this.clock.tick(60 * 1000);
		assert.isFalse(this.clickTestButton(13).attr('data-clicked') == 'true');
	});
});