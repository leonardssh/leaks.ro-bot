const { Client } = require('discord.js');

const Logger = require('@lks/logger');

class LeaksClient extends Client {
	constructor(options = {}) {
		super(options);

		this.logger = new Logger(this);
	}

	async connect(botToken) {
		this.logger.info('Logging into Discord...');
		return super.login(botToken);
	}
}

module.exports = LeaksClient;
