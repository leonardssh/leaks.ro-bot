const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['BAN_MEMBERS'],
			runIn: ['text'],
			description: 'Softbans a mentioned user and removes days of their message history.',
			usage: '<Member:user> [Days:int{1,7}] [Reason:...string]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, days = 1, reason]) {
		if (user.id === msg.author.id) {
			throw 'Why would you ban yourself?';
		}

		if (user.id === this.client.user.id) {
			throw 'Have I done something wrong?';
		}

		const member = await msg.guild.members.fetch(user).catch(() => null);

		if (member) {
			if (member.roles.highest.position >= msg.member.roles.highest.position) {
				throw 'You cannot ban this user.';
			}

			if (!member.bannable) {
				throw 'I cannot ban this user.';
			}
		}

		const options = { days };

		if (reason) {
			options.reason = reason;
		}

		await msg.guild.members.ban(user, options);
		await msg.guild.members.unban(user, 'Softban released.');

		if (msg.guild.settings.channels.modlog) {
			const log = new ModLog(msg.guild);

			log.type = 'softban';
			log.moderator = msg.author;
			log.user = user;
			log.reason = reason;
			log.send();
		}

		return msg.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${msg.author.tag}** softbanned **${member.user.tag}**${
						days ? ` and removes **${days}** days of their message history` : ''
					}, reason: **${reason || 'No reason.'}**`
				)
		);
	}
};
