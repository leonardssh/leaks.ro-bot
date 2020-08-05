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
			usage: '<member:member> [reason:...string]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, reason]) {
		if (member.id === msg.author.id) {
			throw 'Why would you kick yourself?';
		}

		if (member.id === this.client.user.id) {
			throw 'Have I done something wrong?';
		}

		if (member.roles.highest.position >= msg.member.roles.highest.position) {
			throw 'You cannot kick this user.';
		}

		if (!member.kickable) {
			throw 'I cannot kick this user.';
		}

		await member.kick(reason);

		if (msg.guild.settings.channels.modlog) {
			const log = new ModLog(msg.guild);

			log.type = 'kick';
			log.moderator = msg.author;
			log.user = member.user;
			log.reason = reason;
			log.send();
		}

		return msg.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${msg.author.tag}** kicked **${member.user.tag}**, reason: ${
						reason || 'No reason.'
					}`
				)
		);
	}
};
