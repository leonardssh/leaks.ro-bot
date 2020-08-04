const { Command } = require('klasa');
const { MessageEmbed, version } = require('discord.js');
const { stripIndents } = require('common-tags');

const moment = require('moment');
require('moment-duration-format');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			guarded: true,
			description: 'Displays bot stats.',
			aliases: ['botinfo', 'binfo', 'botstats', 'bstats'],
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(message) {
		const platformName = {
			darwin: 'MacOS',
			win32: 'Windows',
			linux: 'Linux'
		};

		const uptime = moment.duration(this.client.uptime).format('Y [years], D [days], H [hours], m [minutes], s [seconds]');

		const creation = this.constructor.daysAgo(this.client.user.createdAt);

		message.sendEmbed(
			new MessageEmbed()
				.setTitle(`Serving ${this.client.users.cache.size} members.`)
				.setColor('#008dff')
				.setDescription(`It has been running without interruption for ${uptime}`)

				.addField(
					':computer: **SYSTEM:**',
					stripIndents`**Memory:**: ${(process.memoryUsage().heapUsed / 1024 ** 2).toFixed(2)}/${(
						require('os').totalmem() /
						1024 ** 2
					).toFixed(2)} MB\n\
                **Platform:** ${platformName[require('os').platform()]}\n\
                **Discord.js:** v${version}\n\
                **NodeJS: **${process.version}\n\
                **Developer:** [Leonard#6666](https://leonard.pw)`,
					true
				)
				.addField(':link: **USEFUL LINKS:**', stripIndents`**Website:** [click here](https://leaks.ro)\n`, true)

				.setThumbnail(this.client.user.avatarURL({ dynamic: true, size: 2048, format: 'png' }))
				.setFooter(`Created ${creation.toFixed(0)} days ago`)
				.setTimestamp(new Date(this.client.user.createdAt))
		);
	}

	static daysAgo(time) {
		var today = new Date();
		var createdOn = new Date(time);
		var msInDay = 24 * 60 * 60 * 1000;

		createdOn.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);

		var diff = (+today - +createdOn) / msInDay;

		return diff;
	}
};
