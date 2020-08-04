const { Client } = require('discord.js');
const { dirname } = require('path');

const Logger = require('@lks/logger');

class LeaksClient extends Client {
	constructor(options = {}) {
		super(options);

		this.baseDirectory = dirname(require.main.filename);

		this.logger = new Logger(this);
	}

	async connect(botToken) {
		this.logger.info('Logging into Discord...');
		return super.login(botToken);
	}
}

module.exports = LeaksClient;
