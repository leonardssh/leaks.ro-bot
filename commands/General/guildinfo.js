const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['ginfo', 'serverinfo', 'sinfo', 'si', 'gi'],
			description: 'Displays guild details.',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(message) {
		const _createdAt = new Date(message.guild.createdAt);
		const _createdAt_Y = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(_createdAt);
		const _createdAt_M = new Intl.DateTimeFormat('en', { month: 'short' }).format(_createdAt);
		const _createdAt_D = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(_createdAt);

		const GUILD_CREATED_AT = `${_createdAt_D} **${_createdAt_M.toUpperCase()}** ${_createdAt_Y}`;

		const GUILD_REGION = {
			europe: ':flag_eu:',
			brazil: ':flag_br:',
			hongkong: ':flag_hk:',
			india: ':flag_in:',
			japan: ':flag_jp:',
			russia: ':flag_ru:',
			singapore: ':flag_sg:',
			southafrica: ':flag_za:',
			sydney: ':flag_au:',
			'us-central': ':flag_us:',
			'us-east': ':flag_us:',
			'us-south': ':flag_us:',
			'us-west': ':flag_us:'
		};

		const guildEmojis = message.guild.emojis.cache
			.map(emoji => `<${emoji.animated == true ? 'a' : ''}:${emoji.name}:${emoji.id}>`)
			.join(' ')
			.substring(0, 1024)
			.replace(/\s\S+[^>]$/, '');

		const guildRoles = message.guild.roles.cache
			.map(role => role.toString())
			.join(' ')
			.substring(0, 1024)
			.replace(/\s\S+[^>]$/, '');

		const members = {
			online: message.guild.members.cache.filter(m => m.presence.status === 'online').size,
			dnd: message.guild.members.cache.filter(m => m.presence.status === 'dnd').size,
			idle: message.guild.members.cache.filter(m => m.presence.status === 'idle').size,
			offline: message.guild.members.cache.filter(m => m.presence.status === 'offline').size,
			bots: message.guild.members.cache.filter(m => m.user.bot).size
		};

		const channels = {
			text: message.guild.channels.cache.filter(channel => channel.type === 'text').size,
			voice: message.guild.channels.cache.filter(channel => channel.type === 'voice').size
		};

		message.sendEmbed(
			new MessageEmbed()
				.setTitle(message.guild.name)
				.setColor('#008dff')
				.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048, format: 'png' }))
				.setDescription(`${message.guild.description != null ? message.guild.description + '\n\n' : ''}ID: ${message.guild.id}`)
				.addField('**OWNER:**', `<:valet_owner:727939428760158259> <@${message.guild.owner.user.id}>`, true)
				.addField(
					'**CHANNELS:**',
					stripIndents`\
                <:valet_text_channel:716360299648647239> Text: ${channels.text}\n\
                <:valet_voice_channel:716360307865288755> Voice: ${channels.voice}`,
					true
				)
				.addField('**REGION:**', `${GUILD_REGION[message.guild.region]} ${message.guild.region.toProperCase()}`, true)
				.addField('**VERIFICATION:**', message.guild.verificationLevel.toProperCase(), true)
				.addField('**BOOSTS:**', message.guild.premiumSubscriptionCount, true)
				.addField(
					'**BANS:**',
					message.channel.permissionsFor(message.guild.me).has('BAN_MEMBERS')
						? (await message.guild.fetchBans()).size
						: '<:valet_nope:716348860389261395> No permission.',
					true
				)
				.addField('**CREATED:**', GUILD_CREATED_AT + ` (${this.constructor.daysAgo(message.guild.createdAt).toFixed(0)} days ago)`)
				.addField(
					`**MEMBERS (${message.guild.memberCount}):**`,
					stripIndents`\
                <:valet_online:716028314334003322>${members.online}\
                <:valet_dnd:716028290615476255>${members.dnd}\
                <:valet_idle:716028299297423420>${members.idle}\
                <:valet_offline:716028306985713707>${members.offline}\
                <:discord:716371058013241384> ${members.bots}`,
					true
				)
				.addField(`**EMOJIS (${message.guild.emojis.cache.size}):**`, guildEmojis)
				.addField(`**ROLES (${message.guild.roles.cache.size}):**`, guildRoles)
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
