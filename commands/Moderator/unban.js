const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['BAN_MEMBERS'],
			runIn: ['text'],
			description: 'Unbans the mentioned user.',
			usage: '<User:user> [Reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(message, [user, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const bans = await message.guild.fetchBans();

		if (bans.has(user.id) === false) {
			throw `${message.author}, this user is not banned.`;
		}

		await message.guild.members.unban(user, reason);

		if (message.guild.settings.channels.modlog) {
			const log = new ModLog(message.guild);

			log.type = 'unban';
			log.moderator = message.author;
			log.user = user;
			log.reason = reason;
			log.send();
		}

		return message.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${message.author.tag}** unbanned **${user.tag}**, reason: **${
						reason || 'No reason.'
					}**`
				)
		);
	}
};
