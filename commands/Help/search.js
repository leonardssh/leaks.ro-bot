const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Look for commands by keywords.',
			usage: '<Keyword:str>',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(message, [keyword]) {
		keyword = keyword.toLowerCase();

		let commands = this.client.commands.map(c => c.name.toLowerCase()).filter(c => c.includes(keyword));

		if (!commands.length) {
			return message.sendEmbed(
				new MessageEmbed()
					.setColor('#e74c3c')
					.setDescription(
						`<:valet_nope:716348860389261395> ${message.author}, I'm sorry, but I didn't find any command containing these keywords.`
					)
			);
		}

		message.sendEmbed(
			new MessageEmbed()
				.setColor('#008dff')
				.setDescription(`<:valet_yeah:716348838289342496> I found ${commands.length} commands containing **${keyword}**.`)
				.addField('Commands:', `\`\`\`diff\n${commands.join('\n')}\`\`\``)
				.addField(':grey_question: Want more details?', `Use \`help [Command]\` for more details about a specific command.`)
		);
	}
};
