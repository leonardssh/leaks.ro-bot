const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['BAN_MEMBERS'],
			runIn: ['text'],
			requiredSettings: ['channels.modlog'],
			description: 'Bans the specified user and removes days of their message history.',
			usage: '<User:user> [Days:int{1,7}] [Reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(message, [user, days = 0, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const member = await message.guild.members.fetch(user).catch(() => null);

		if (!member) {
			throw `${message.author}, this user is no longer on the server.`;
		}

		if (member.roles.highest.position >= message.member.roles.highest.position) {
			throw `${message.author}, you may not execute this command on this member.`;
		}

		if (member.bannable === false) {
			throw `${message.author}, I am not able to ban this member, sorry.`;
		}

		await message.guild.members.ban(user, { reason, days });

		if (message.guild.settings.channels.modlog) {
			const log = new ModLog(message.guild);

			log.type = 'ban';
			log.moderator = message.author;
			log.user = user;
			log.reason = reason;
			log.send();
		}

		return message.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${message.author.tag}** banned **${user.tag}**${
						days ? ` and removes **${days}** days of their message history` : ''
					}, reason: **${reason || 'No reason.'}**`
				)
		);
	}
};
