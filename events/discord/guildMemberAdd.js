const { Event } = require('klasa');
const { welcomer } = require('../../utils/welcomer');

module.exports = class extends Event {
	async run(member) {
		const guild = member.guild;
		const memberRole = await guild.roles.cache.get(guild.settings.member);

		if (!memberRole) {
			return;
		}

		await member.roles.add(guild.settings.member);

		const welcomeChannel = guild.channels.cache.get(guild.settings.channels.welcome);

		if (!welcomeChannel) {
			return;
		}

		return welcomer(welcomeChannel, member);
	}
};
