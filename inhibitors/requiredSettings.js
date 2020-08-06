const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {
	run(message, command) {
		if (!command.requiredSettings.length || message.channel.type !== 'text') {
			return;
		}

		const requiredSettings = command.requiredSettings.filter(setting => message.guild.settings.get(setting) == null);

		if (requiredSettings.length) {
			throw {
				description: `<:valet_nope:716348860389261395> The guild is missing the **${requiredSettings.join(', ')}** guild setting${
					requiredSettings.length !== 1 ? 's' : ''
				} and thus the command cannot run.`,
				color: '#e74c3c'
			};
		}
	}
};
