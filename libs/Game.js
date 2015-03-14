var Backbone = require('backbone'),
	$ = require('jquery');
Backbone.$ = $;
module.exports = Backbone.View.extend({

	_isBoardExists : false,

	events : {
		'click button.field' : 'onFieldClick'
	},

	/**
	 * Standard initializer.
	 */
	 initialize: function() {
		this.getBoardEl();
		this._counter = 1;
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
		var elements = '';
		for (var i = 0; i < 100; i++) {
			elements +=
				'<button class="field" data-number="' + i + '" data-clicked="false"></button>'
		}
		return elements;
	 },

	/**
	 *
	 */
	 onFieldClick: function(ev) {
		var target = this.$(ev.currentTarget);
		if (target.data('clicked') == false) {
			this._counter = this._counter + 1;
			target.data('clicked', true);
		}
	 },

	getCounterState: function() {
		return this._counter;
	}
});