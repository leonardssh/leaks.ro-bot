const {
	Command,
	util: { toTitleCase, codeBlock }
} = require('klasa');

const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 7,
			guarded: true,
			subcommands: true,
			description: language => language.get('COMMAND_CONF_SERVER_DESCRIPTION'),
			usage: '<set|show|remove|reset> (key:key) (value:value) [...]',
			usageDelim: ' '
		});

		this.createCustomResolver('key', (arg, possible, message, [action]) => {
			if (action === 'show' || arg) return arg;
			throw message.language.get('COMMAND_CONF_NOKEY');
		}).createCustomResolver('value', (arg, possible, message, [action]) => {
			if (!['set', 'remove'].includes(action) || arg) return arg;
			throw message.language.get('COMMAND_CONF_NOVALUE');
		});
	}

	show(message, [key]) {
		const path = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, errors: false, piece: null });

		if (!path) {
			return message.sendEmbed(
				new MessageEmbed()
					.setDescription(`<:valet_nope:716348860389261395> The key **${key}** does not seem to exist.`)
					.setColor('#e74c3c')
			);
		}

		if (path.piece.type === 'Folder') {
			return message.sendLocale('COMMAND_CONF_SERVER', [
				key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
				codeBlock('asciidoc', message.guild.settings.list(message, path.piece))
			]);
		}

		return message.sendEmbed(
			new MessageEmbed()
				.setDescription(
					`The value for the key **${path.piece.path}** is: \`${message.guild.settings.resolveString(message, path.piece)}\``
				)
				.setColor('#008dff')
		);
	}

	async set(message, [key, ...valueToSet]) {
		const status = await message.guild.settings.update(key, valueToSet.join(' '), message.guild, {
			avoidUnconfigurable: true,
			action: 'add'
		});

		return (
			this.check(message, key, status) ||
			message.sendEmbed(
				new MessageEmbed()
					.setDescription(
						`<:valet_yeah:716348838289342496> Successfully updated the key **${key}**: \`${message.guild.settings.resolveString(
							message,
							status.updated[0].piece
						)}\``
					)
					.setColor('#43b581')
			)
		);
	}

	async remove(message, [key, ...valueToRemove]) {
		const status = await message.guild.settings.update(key, valueToRemove.join(' '), message.guild, {
			avoidUnconfigurable: true,
			action: 'remove'
		});

		return (
			this.check(message, key, status) ||
			message.sendEmbed(
				new MessageEmbed()
					.setDescription(
						`<:valet_yeah:716348838289342496> Successfully updated the key **${key}**: \`${message.guild.settings.resolveString(
							message,
							status.updated[0].piece
						)}\``
					)
					.setColor('#43b581')
			)
		);
	}

	async reset(message, [key]) {
		const status = await message.guild.settings.reset(key, message.guild, true);

		return (
			this.check(message, key, status) ||
			message.sendEmbed(
				new MessageEmbed()
					.setDescription(
						`<:valet_yeah:716348838289342496> The key **${key}** has been reset to: \`${message.guild.settings.resolveString(
							message,
							status.updated[0].piece
						)}\``
					)
					.setColor('#43b581')
			)
		);
	}

	check(message, key, { errors, updated }) {
		if (errors.length) {
			return message.sendEmbed(
				new MessageEmbed().setDescription(`<:valet_nope:716348860389261395> ${String(errors[0])}`).setColor('#e74c3c')
			);
		}

		if (!updated.length) {
			message.sendEmbed(
				new MessageEmbed()
					.setDescription(`<:valet_nope:716348860389261395> The value for **${key}** was already that value.`)
					.setColor('#e74c3c')
			);
		}

		return null;
	}
};
