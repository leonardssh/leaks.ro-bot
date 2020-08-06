const { Command, util } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			runIn: ['text'],
			requiredSettings: ['channels.modlog'],
			description: `Edit the reason field from a case.`,
			usage: '<Case:integer> <Reason:string> [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [selected, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const modlogs = msg.guild.settings.modlogs;
		const log = modlogs[selected];

		if (!log) {
			throw `${msg.author}, there is no modlog under that case.`;
		}

		const channel = msg.guild.channels.cache.get(msg.guild.settings.channels.modlog);

		if (!channel) {
			throw `${msg.author}, the modlog channel does not exist, did it get deleted?`;
		}

		const messages = await channel.messages.fetch({ limit: 100 });

		const message = messages.find(
			mes =>
				mes.author.id === this.client.user.id &&
				mes.embeds.length > 0 &&
				mes.embeds[0].type === 'rich' &&
				mes.embeds[0].footer &&
				mes.embeds[0].footer.text.startsWith(`Case #${selected}`)
		);

		if (message) {
			const embed = message.embeds[0];
			const [moderator] = embed.description.split('\n');

			embed.description = [moderator, `**Reason:** ${reason}`].join('\n');

			await message.edit({ embed });
		} else {
			const [user, moderator] = await Promise.all([this.client.users.fetch(log.user), this.client.users.fetch(log.moderator)]);

			await channel.sendEmbed(
				new MessageEmbed()
					.setAuthor(
						`[${log.type.toUpperCase()}] ${user.tag} (${user.id})`,
						user.avatarURL({ dynamic: true, size: 2048, format: 'png' })
					)
					.setColor(ModLog.colour(log.type))
					.setDescription([`**Moderator:** ${moderator.tag} (${moderator.id})`, `**Reason:** ${reason}`])
					.setFooter(`Case #${selected}`)
					.setTimestamp()
			);
		}

		const oldReason = log.reason;

		modlogs[selected].reason = reason;

		const { errors } = await msg.guild.settings.update('modlogs', modlogs, { action: 'overwrite' });

		if (errors.length) {
			throw errors[0];
		}

		return msg.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> Successfully updated the log ${selected}.${util.codeBlock(
						'http',
						[`Old reason : ${oldReason || 'Not set.'}`, `New reason : ${reason}`].join('\n')
					)}`
				)
		);
	}
};
