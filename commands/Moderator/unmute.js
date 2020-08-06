const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['MANAGE_ROLES'],
			runIn: ['text'],
			requiredSettings: ['channels.modlog'],
			description: 'Unmutes a mentioned user.',
			usage: '<Member:member> [Reason:...string]',
			usageDelim: ' '
		});
	}

	async run(message, [member, reason]) {
		if (member.roles.highest.position >= message.member.roles.highest.position) {
			throw 'You cannot unmute this user.';
		}

		if (!member.roles.cache.has(message.guild.settings.muted)) {
			throw 'This user is not muted.';
		}

		await member.roles.remove(message.guild.settings.muted);

		if (message.guild.settings.channels.modlog) {
			const log = new ModLog(message.guild);

			log.type = 'unmute';
			log.moderator = message.author;
			log.user = member.user;
			log.reason = reason;
			log.send();
		}

		return message.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${message.author.tag}** unmuted **${member.user.tag}**, reason: ${
						reason || 'No reason.'
					}`
				)
		);
	}
};
