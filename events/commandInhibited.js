const { Event } = require('klasa');

module.exports = class extends Event {
	run(message, command, response) {
		if (response && response.length) {
			return message[typeof response[0] === 'object' ? 'sendEmbed' : 'sendMessage'](response[0]);
		}
	}
};
