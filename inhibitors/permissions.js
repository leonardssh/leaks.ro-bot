const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {
	async run(message, command) {
		const { broke, permission } = await this.client.permissionLevels.run(message, command.permissionLevel);

		if (!permission)
			throw broke
				? {
						title: 'Insufficient permissions',
						description: `<:valet_nope:716348860389261395> ${message.author}, you don't have the necessary permissions to execute this command.`,
						color: '#e74c3c'
				  }
				: true;
	}
};
