const { Monitor } = require('klasa');

module.exports = class extends Monitor {
	constructor(...args) {
		super(...args, {
			name: 'inviteDetection',
			enabled: true,
			ignoreSelf: true,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.antiInvite) {
			return null;
		}

		if (await msg.hasAtLeastPermissionLevel(7)) {
			return null;
		}

		if (!/(https?:\/\/)?(www\.)?(discord\.(com|gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(msg.content)) {
			return null;
		}

		return msg.delete().catch(err => this.client.emit('log', err, 'error'));
	}
};
