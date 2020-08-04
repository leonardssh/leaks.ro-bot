const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Latency and API response times.',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(message) {
		message.sendEmbed(new MessageEmbed().setColor('#36393f').setTitle(`Latency and API response times.`)).then(m =>
			m.edit(
				new MessageEmbed()
					.setColor('#008dff')
					.setTitle(`Latency and API response times.`)
					.setDescription(`:ping_pong: Pong!`)
					.addField('**LATENCY:**', `${m.createdTimestamp - message.createdTimestamp}ms`, true)
					.addField('**API LATENCY:**', `${Math.round(this.client.ws.ping)}ms`, true)
			)
		);
	}
};
