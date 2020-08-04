const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {
	run(message, command) {
		if (!command.enabled) {
			throw {
				description: '<:valet_nope:716348860389261395> ' + message.language.get('INHIBITOR_DISABLED_GLOBAL'),
				color: '#e74c3c'
			};
		}

		if (message.guildSettings.disabledCommands.includes(command.name)) {
			throw {
				description: '<:valet_nope:716348860389261395> ' + message.language.get('INHIBITOR_DISABLED_GUILD'),
				color: '#e74c3c'
			};
		}
	}
};
