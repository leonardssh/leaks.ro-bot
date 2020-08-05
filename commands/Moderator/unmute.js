const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['MANAGE_ROLES'],
			runIn: ['text'],
			description: 'Unmutes a mentioned user.',
			usage: '<member:member> [reason:...string]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, reason]) {
		if (member.roles.highest.position >= msg.member.roles.highest.position) {
			throw 'You cannot unmute this user.';
		}

		if (!member.roles.cache.has(msg.guild.settings.muted)) {
			throw 'This user is not muted.';
		}

		await member.roles.remove(msg.guild.settings.muted);

		if (msg.guild.settings.channels.modlog) {
			const log = new ModLog(msg.guild);

			log.type = 'unmute';
			log.moderator = msg.author;
			log.user = member.user;
			log.reason = reason;
			log.send();
		}

		return msg.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${msg.author.tag}** unmuted **${member.user.tag}**, reason: ${
						reason || 'No reason.'
					}`
				)
		);
	}
};
