const {
	Command,
	util: { isFunction }
} = require('klasa');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			guarded: true,
			description: 'Shows you the help center.',
			usage: '(Command:command)',
			requiredPermissions: ['EMBED_LINKS']
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') {
				return undefined;
			}

			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}

	async run(message, [command]) {
		if (command) {
			const { name, description, category, usage, aliases, requiredPermissions } = command;

			return message.sendEmbed(
				new MessageEmbed()
					.setTitle(`${name} command`)
					.setColor('#008dff')
					.setDescription(isFunction(description) ? description(message.language) : description)
					.addField('**__CATEGORY__**', category)
					.addField('**__USAGE__**', `\`\`\`\n${usage.fullUsage(message)}\`\`\``)
					.addField(
						'**__CLIENT PERMISSIONS__**',
						`\`\`\`\n${
							requiredPermissions
								.toArray()
								.map(key => key.replace('_', ' '))
								.join(', ') || 'No permissions set.'
						}\`\`\``,
						true
					)
			);
		}

		message.sendEmbed(
			new MessageEmbed()
				.setTitle(`Help Center`)
				.setColor('#008dff')
				.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048, format: 'png' }))
				.setDescription(
					stripIndents`Hi ${message.author}, nice to meet you! :wave:\n\
						Looks like you need help, let me help you! :hugging:\n\n\
						`
				)
				.addField(`:grey_question: Want to know what my prefixes are?`, 'Mention me!')
				.addField(`:grey_question: Want to know all the commands I've? :face_with_monocle:`, `Use the \`commands\` command!`)
				.addField(`:grey_question: Want to know more details about a specific command?`, 'Use the `help [Command]` command!')
				.addField(":grey_question: Can't find a command? Search for it using a keyword!", `Use the \`search [Keyword]\` command!`)
				.setFooter(this.client.user.username, this.client.user.avatarURL({ dynamic: true, size: 2048, format: 'png' }))
				.setTimestamp()
		);
	}
};
