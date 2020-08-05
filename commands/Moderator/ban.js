const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['BAN_MEMBERS'],
			runIn: ['text'],
			description: 'Bans the specified user and removes days of their message history.',
			usage: '<User:user> [Days:int{1,7}] [Reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, days = 0, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const member = await msg.guild.members.fetch(user).catch(() => null);

		if (!member) {
			throw `${msg.author}, this user is no longer on the server.`;
		} else if (member.roles.highest.position >= msg.member.roles.highest.position) {
			throw `${msg.author}, you may not execute this command on this member.`;
		} else if (member.bannable === false) {
			throw `${msg.author}, I am not able to ban this member, sorry.`;
		}

		await msg.guild.members.ban(user, { reason, days });

		if (msg.guild.settings.channels.modlog) {
			const log = new ModLog(msg.guild);

			log.type = 'ban';
			log.moderator = msg.author;
			log.user = user;
			log.reason = reason;
			log.send();
		}

		return msg.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${msg.author.tag}** banned **${user.tag}**${
						days ? ` and removes **${days}** days of their message history` : ''
					}, reason: **${reason || 'No reason.'}**`
				)
		);
	}
};
