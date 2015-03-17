var $ = require('jquery');
$(document).ready(function() {
	var Game = require('./libs/Game');
	new Game({
		el : 'body'
	});
});
