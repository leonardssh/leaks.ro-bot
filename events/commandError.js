const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
	run(message, command, params, error) {
		if (error instanceof Error) {
			this.client.emit('wtf', `[COMMAND] ${command.path}\n${error.stack || error}`);
		}

		if (error.message) {
			message
				.sendEmbed(new MessageEmbed().setColor('#e74c3c').setTitle('Error').setDescription(`\`\`\`JSON\n${error.message}\`\`\``))
				.catch(err => this.client.emit('wtf', err));
		} else {
			message
				.sendEmbed(new MessageEmbed().setColor('#e74c3c').setDescription(`<:valet_nope:716348860389261395> ${error}`))
				.catch(err => this.client.emit('wtf', err));
		}
	}
};
