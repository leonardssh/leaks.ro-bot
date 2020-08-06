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

	async run(msg, [user, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const bans = await msg.guild.fetchBans();

		if (bans.has(user.id) === false) {
			throw `${msg.author}, this user is not banned.`;
		}

		await msg.guild.members.unban(user, reason);

		if (msg.guild.settings.channels.modlog) {
			const log = new ModLog(msg.guild);

			log.type = 'unban';
			log.moderator = msg.author;
			log.user = user;
			log.reason = reason;
			log.send();
		}

		return msg.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${msg.author.tag}** unbanned **${user.tag}**, reason: **${reason || 'No reason.'}**`
				)
		);
	}
};
