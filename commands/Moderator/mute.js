const { Command, Duration } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['MANAGE_ROLES'],
			runIn: ['text'],
			description: 'Mutes a mentioned member.',
			usage: '<Member:member> [When:time] [Reason:...string]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, when, reason]) {
		if (member.id === msg.author.id) {
			throw 'Why would you mute yourself?';
		}

		if (member.id === this.client.user.id) {
			throw 'Have I done something wrong?';
		}

		if (member.roles.highest.position >= msg.member.roles.highest.position) {
			throw 'You cannot mute this user.';
		}

		if (member.roles.cache.has(msg.guild.settings.muted)) {
			throw 'The member is already muted.';
		}

		await member.roles.add(msg.guild.settings.muted);

		if (when) {
			await this.client.schedule.create('unmute', when, {
				data: {
					guild: msg.guild.id,
					user: member.id
				}
			});
		}

		if (msg.guild.settings.channels.modlog) {
			const log = new ModLog(msg.guild);

			log.type = 'mute';
			log.moderator = msg.author;
			log.user = member.user;
			log.reason = reason;
			log.send();
		}

		return msg.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${msg.author.tag}** muted **${member.user.tag}**${
						when ? ` for **${Duration.toNow(when)}**` : ''
					}, reason: ${reason || 'No reason.'}`
				)
		);
	}
};
