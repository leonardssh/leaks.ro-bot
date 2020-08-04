const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const moment = require('moment');
require('moment-duration-format');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			guarded: true,
			aliases: ['up'],
			description: 'Displays bot uptime.',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(message) {
		const uptime = moment.duration(this.client.uptime).format('Y [years], D [days], H [hours], m [minutes], s [seconds]');

		message.sendEmbed(
			new MessageEmbed()
				.setColor('#008dff')
				.addField(':clock1130: **UPTIME:**', `It has been running without interruption for ${uptime}`)
		);
	}
};
