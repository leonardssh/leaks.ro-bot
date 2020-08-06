const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['KICK_MEMBERS'],
			runIn: ['text'],
			description: 'Kicks a mentioned user.',
			usage: '<Member:member> [Reason:...string]',
			usageDelim: ' '
		});
	}

	async run(message, [member, reason]) {
		if (member.id === message.author.id) {
			throw 'Why would you kick yourself?';
		}

		if (member.id === this.client.user.id) {
			throw 'Have I done something wrong?';
		}

		if (member.roles.highest.position >= message.member.roles.highest.position) {
			throw 'You cannot kick this user.';
		}

		if (!member.kickable) {
			throw 'I cannot kick this user.';
		}

		await member.kick(reason);

		if (message.guild.settings.channels.modlog) {
			const log = new ModLog(message.guild);

			log.type = 'kick';
			log.moderator = message.author;
			log.user = member.user;
			log.reason = reason;
			log.send();
		}

		return message.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${message.author.tag}** kicked **${member.user.tag}**, reason: ${
						reason || 'No reason.'
					}`
				)
		);
	}
};
