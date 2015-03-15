var Backbone = require('backbone'),
	$ = require('jquery'),
	_ = require('underscore');
Backbone.$ = $;
module.exports = Backbone.View.extend({

	_isBoardExists : false,
	_lastClickedEl : null,
	_isGameInProgress: false,

	_oneRowDistanceCounters  : [-12, -8, 8, 12],
	_twoRowsDistanceCounters : [-21, -19, 19, 21],

	events : {
		'click button.field' : 'onFieldClick'
	},

	/**
	 * Standard initializer.
	 */
	 initialize: function() {
		this.getBoardEl();
		this._counter = 1;
		this._isGameInProgress = true;
	},

	/**
	 *
	 */
	 getBoardEl: function() {
		if (!this._isBoardExists) {
			this.$el.append(
				'<div id="game-board">' +
				this._createFields() +
				'</div>'
			);
			this._isBoardExists = true;
		}
		return $('#game-board');
	 },

	/**
	 *
	 */
	 _createFields: function() {
		var elements = '', num = 0;
		for (var row = 1; row <=10; row++) {
			elements += '<p class="row" data-number="' + row + '">';
			for (var i = 1; i <= 10; i++) {
				num++;
				elements +=
					'<button class="field" data-number="' + num + '" data-clicked="false"></button>'
			}
			elements += '</p>';
		}
		return elements;
	 },

	/**
	 *
	 */
	 onFieldClick: function(ev) {
		var target = this.$(ev.currentTarget);
		if (target.attr('data-clicked') === 'true') {
			return;
		}
		if (!this.getLastClickedEl()) {
			target.attr('data-clicked', true);
			this._displayStep(target);
			this._counter = this._counter + 1;
			this._lastClickedEl = target;
		}
		else if (this._isValidField(target)) {
			target.attr('data-clicked', true);
			this._displayStep(target);
			this._counter = this._counter + 1;
			this._lastClickedEl = target;
		}
		if (this._getPossibleFieldsAround(target).length == 0) {
			this._endGame();
		}
	 },

	/**
	 *
	 * @param field
	 * @private
	 */
	_displayStep : function(field) {
		field.html(this._counter);
	},

	/**
	 *
	 * @param field
	 * @returns {boolean}
	 * @private
	 */
	 _isValidField: function(field) {
		var isValidField = true,
			possibleFields =  this._getPossibleFieldsAround(this.getLastClickedEl());
		if (possibleFields.length == 0) {
			this._endGame();
		}
		if (this.getLastClickedEl()) {
			isValidField = possibleFields.indexOf(field.attr('data-number')) != -1;
		}
		return isValidField;
	 },

	/**
	 *
	 * @param field
	 * @returns {Array.<T>|string|*}
	 * @private
	 */
	_getPossibleFieldsAround : function(field) {
		var fieldNumber = parseInt(field.attr('data-number')), possibleFieldEl, num,
			oneRowArray = _.map(this._oneRowDistanceCounters, _.bind(function(i) {
			num = fieldNumber + i;
			possibleFieldEl = this.$('button[data-number=' + num + ']');
			if (num > 0 &&
				this._isOneRowDistance(field, possibleFieldEl) &&
				possibleFieldEl.attr('data-clicked') === 'false'
			) {
				possibleFieldEl.addClass('hilit');
				return possibleFieldEl.attr('data-number');
			}
		}, this));
		var twoRowsArray = _.map(this._twoRowsDistanceCounters, _.bind(function(i) {
			num = fieldNumber + i;
			possibleFieldEl = this.$('button[data-number=' + num + ']');
			if (num > 0 &&
				this._isTwoRowsDistance(field, possibleFieldEl) &&
				possibleFieldEl.attr('data-clicked') === 'false'
			) {
				possibleFieldEl.addClass('hilit');
				return possibleFieldEl.attr('data-number');
			}
		}, this));
		return _.compact(oneRowArray.concat(twoRowsArray));
	},

	/**
	 *
	 * @param field1
	 * @param field2
	 * @returns {boolean}
	 * @private
	 */
	_areInTheSameRow: function(field1, field2) {
		return this._getRowNumber(field1) == this._getRowNumber(field2);
	},

	/**
	 *
	 * @param field1
	 * @param field2
	 * @returns {boolean}
	 * @private
	 */
	_isOneRowDistance: function(field1, field2) {
		return Math.abs(this._getRowNumber(field2) - this._getRowNumber(field1)) == 1;
	 },
	/**
	 *
	 * @param field1
	 * @param field2
	 * @returns {boolean}
	 * @private
	 */
	_isTwoRowsDistance: function(field1, field2) {
		return Math.abs(this._getRowNumber(field2) - this._getRowNumber(field1)) == 2;
	 },

	/**
	 *
	 */
	 _getRowNumber: function(field) {
		return parseInt(field.parent('p.row').attr('data-number'));
	 },

	/**
	 *
	 */
	 getLastClickedEl: function() {
		return this._lastClickedEl;
	 },

	getCounterState: function() {
		return this._counter;
	},

	_endGame: function() {
		this._isGameInProgress = false;
	},

	isGameInProgress : function() {
		return this._isGameInProgress;
	}
});