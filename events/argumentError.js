const {
	Event,
	util: { isFunction }
} = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
	run(message, command, params, error) {
		message
			.sendEmbed(
				new MessageEmbed()
					.setColor('#e74c3c')
					.setTitle('Invalid Command Syntax')
					.setDescription(isFunction(command.description) ? description(message.language) : command.description)
					.addField('**Usage**', `\`\`\`js\n${command.usage.fullUsage(message)}\`\`\``)
					.addField('**Need help?**', `Use the \`help ${command.name}\` command for more details about this command.`)
			)
			.catch(err => this.client.emit('wtf', err));
	}
};
