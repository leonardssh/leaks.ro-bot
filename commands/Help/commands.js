const {
	Command,
	RichDisplay,
	util: { isFunction }
} = require('klasa');
const { MessageEmbed, Permissions } = require('discord.js');

const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADD_REACTIONS]);
const time = 1000 * 60 * 3;

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['cmd', 'cmds'],
			description: 'Shows you help for all commands.',
			requiredPermissions: ['EMBED_LINKS']
		});

		this.handlers = new Map();
	}

	async run(message) {
		if (!('all' in message.flags) && message.guild && message.channel.permissionsFor(this.client.user).has(PERMISSIONS_RICHDISPLAY)) {
			const previousHandler = this.handlers.get(message.author.id);
			if (previousHandler) {
				previousHandler.stop();
			}

			const handler = await (await this.buildDisplay(message)).run(await message.send('Loading Commands...'), {
				filter: (reaction, user) => user.id === message.author.id,
				time
			});

			handler.on('end', () => this.handlers.delete(message.author.id));
			this.handlers.set(message.author.id, handler);
			return handler;
		}
	}

	async buildDisplay(message) {
		const commands = await this._fetchCommands(message);
		const display = new RichDisplay().setFooterPrefix(`Total Commands: ${this.client.commands.size} • Page: `);
		const { prefix } = message.guildSettings;

		for (const [category, list] of commands) {
			display.addPage(
				new MessageEmbed()
					.setColor('#008dff')
					.setDescription(
						`**__PREFIXES__**\n${prefix
							.map(pre => `\`${pre}\``)
							.join(', ')}\n\n **__${category.toUpperCase()} COMMANDS__**\n${list
							.map(this.formatCommand.bind(this, message, true))
							.join('\n')}`
					)
			);
		}

		return display;
	}

	formatCommand(message, richDisplay, command) {
		const description = isFunction(command.description) ? command.description(message.language) : command.description;
		return richDisplay ? `\`${command.name}\` - ${description}` : `\`${command.name}\` - ${description}`;
	}

	async _fetchCommands(message) {
		const run = this.client.inhibitors.run.bind(this.client.inhibitors, message);
		const commands = new Map();

		await Promise.all(
			this.client.commands.map(command =>
				run(command, true)
					.then(() => {
						const category = commands.get(command.category);

						if (category) {
							category.push(command);
						} else {
							commands.set(command.category, [command]);
						}
					})
					.catch(() => {
						// noop
					})
			)
		);

		return commands;
	}
};
