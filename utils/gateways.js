const { Schema } = require('klasa');

module.exports = {
	gateways: {
		guilds: {
			schema: new Schema()
				.add('disabledCommands', 'command', {
					array: true,
					filter: (client, command, piece, language) => {
						if (command.guarded) throw language.get('COMMAND_CONF_GUARDED', command.name);
					}
				})
				.add('antiInvite', 'boolean', { default: false })
				.add('muted', 'role')
				.add('moderator', 'role')
				.add('member', 'role')
				.add('filteredWords', 'string', { default: [], array: true })
				.add('channels', folder => folder.add('modlog', 'TextChannel'))
				.add('modlogs', 'any', { array: true })
		}
	}
};
