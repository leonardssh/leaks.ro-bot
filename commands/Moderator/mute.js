const { Command, Duration } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['MANAGE_ROLES'],
			runIn: ['text'],
			requiredSettings: ['modlog'],
			description: 'Mutes a mentioned member.',
			usage: '<Member:member> [When:time] [Reason:...string]',
			usageDelim: ' '
		});
	}

	async run(message, [member, when, reason]) {
		if (member.id === message.author.id) {
			throw 'Why would you mute yourself?';
		}

		if (member.id === this.client.user.id) {
			throw 'Have I done something wrong?';
		}

		if (member.roles.highest.position >= message.member.roles.highest.position) {
			throw 'You cannot mute this user.';
		}

		if (member.roles.cache.has(message.guild.settings.muted)) {
			throw 'The member is already muted.';
		}

		await member.roles.add(message.guild.settings.muted);

		if (when) {
			await this.client.schedule.create('unmute', when, {
				data: {
					guild: message.guild.id,
					user: member.id
				}
			});
		}

		if (message.guild.settings.channels.modlog) {
			const log = new ModLog(message.guild);

			log.type = 'mute';
			log.moderator = message.author;
			log.user = member.user;
			log.reason = reason;
			log.send();
		}

		return message.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${message.author.tag}** muted **${member.user.tag}**${
						when ? ` for **${Duration.toNow(when)}**` : ''
					}, reason: ${reason || 'No reason.'}`
				)
		);
	}
};
