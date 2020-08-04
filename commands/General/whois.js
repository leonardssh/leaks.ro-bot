const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Displays the account details of the specified user.',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(message) {
		let target = message.mentions.users.first() || message.author;
		const user = message.guild.member(target);

		const _createdAt = new Date(target.createdAt);
		const _createdAt_Y = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(_createdAt);
		const _createdAt_M = new Intl.DateTimeFormat('en', { month: 'short' }).format(_createdAt);
		const _createdAt_D = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(_createdAt);

		const TARGET_CREATED_AT = `${_createdAt_D} **${_createdAt_M.toUpperCase()}** ${_createdAt_Y}`;

		const _joinedAt = new Date(user.joinedAt);
		const _joinedAt_Y = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(_joinedAt);
		const _joinedAt_M = new Intl.DateTimeFormat('en', { month: 'short' }).format(_joinedAt);
		const _joinedAt_D = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(_joinedAt);

		const TARGET_JOINED_AT = `${_joinedAt_D} **${_joinedAt_M.toUpperCase()}** ${_joinedAt_Y}`;

		const DISCORD_BADGES = {
			DISCORD_EMPLOYEE: '<:staff:716328965941231626>',
			DISCORD_PARTNER: '<:partener:716328704308936765>',
			HYPESQUAD_EVENTS: '<:hypesquad_events:716328685858324514>',
			BUGHUNTER_LEVEL_1: '<:bughunter:716328669764648960>',
			HOUSE_BRAVERY: '<:bravery:716328650122854411>',
			HOUSE_BRILLIANCE: '<:brilliance:716328659828605092>',
			HOUSE_BALANCE: '<:balance:716328641411416084>',
			EARLY_SUPPORTER: '<:supporter:716328722407489576>',
			TEAM_USER: '',
			SYSTEM: '<:system:716392353794883637>',
			BUGHUNTER_LEVEL_2: '<:bughunter2:716392362573692949>',
			VERIFIED_BOT: '<:bot_verified:716341932053233664>',
			VERIFIED_DEVELOPER: '<:bot_developer:716341917008265248>'
		};

		const TARGET_BADGES = [];

		for (const flags of target.flags.toArray()) {
			TARGET_BADGES.push(DISCORD_BADGES[flags]);
		}

		const whoisEmbed = new MessageEmbed()
			.setTitle(`${target.tag}\'s account details`)
			.setThumbnail(target.avatarURL({ dynamic: true, size: 2048, format: 'png' }))
			.setColor('#008dff')
			.setDescription(`ID: ${user.id}`)
			.addField('**TAG:**', '#' + target.discriminator, true)
			.addField('**USERNAME:**', user.nickname ? user.nickname : 'None', true)
			.addField(
				'**STATUS:**',
				this.constructor.getTargetEmojiByStatus(
					target.presence.status,
					target.presence.clientStatus != undefined && target.presence.clientStatus.mobile
				),
				true
			)
			.addField(`**HIGHEST ROLE:**`, user.roles.highest.toString(), true)
			.addField('**BADGES:**', TARGET_BADGES.length > 0 ? TARGET_BADGES.join(' ') : '<:valet_nope:716348860389261395>', true)
			.addField('**BOT:**', target.bot ? '<:valet_yeah:716348838289342496>' : '<:valet_nope:716348860389261395>', true);

		const TARGET_PRESENCE_LAST = target.presence.activities.length > 1 ? '\n――――――――' : '';

		if (target.presence != undefined && target.presence.activities.length > 0) {
			whoisEmbed.addField(
				'**CUSTOM STATUS:**',
				target.presence.activities.map(activity => {
					return (
						(
							(activity.emoji != undefined && activity.emoji !== 'null'
								? activity.emoji.id != undefined
									? `<${activity.emoji.animated === true ? 'a' : ''}:${activity.emoji.name}:${activity.emoji.id}>`
									: `${activity.emoji.name}`
								: '') +
							(activity.type != undefined && activity.type !== 'null'
								? activity.type === 'CUSTOM_STATUS'
									? ''
									: activity.type.toProperCase()
								: '') +
							(activity.name != undefined && activity.name !== 'null'
								? activity.name === 'Custom Status'
									? activity.state != undefined && activity.state !== 'null'
										? ' **' + activity.state + '**'
										: ''
									: ' **' + activity.name + '**'
								: '') +
							'\n' +
							(activity.details != undefined && activity.details !== 'null' ? activity.details : '') +
							'\n' +
							(activity.details != undefined && activity.details !== 'null'
								? activity.state != undefined && activity.state !== 'null'
									? activity.state
									: ''
								: '') +
							'\n' +
							(activity.timestamps != undefined && activity.timestamps !== 'null'
								? this.constructor.formatDate(new Date(activity.timestamps.start).getTime()) + ' elapsed'
								: '') +
							'\n'
						).replace(/(^n\s+|\s+$)/g, '') +
						(target.presence.activities[target.presence.activities.length - 1] == activity ? '' : TARGET_PRESENCE_LAST)
					);
				})
			);
		}

		whoisEmbed.addField(
			'**CREATED:**',
			TARGET_CREATED_AT + ` (${this.constructor.daysAgo(target.createdAt).toFixed(0)} days ago)`,
			true
		);
		whoisEmbed.addField('**JOINED:**', TARGET_JOINED_AT + ` (${this.constructor.daysAgo(user.joinedAt).toFixed(0)} days ago)`, true);

		message.sendEmbed(whoisEmbed);
	}

	static getTargetEmojiByStatus(status, mobile) {
		switch (status) {
			case 'dnd':
				return '<:valet_dnd:716028290615476255> **dnd**';
			case 'idle':
				return '<:valet_idle:716028299297423420> **idle**';
			case 'offline':
				return '<:valet_offline:716028306985713707> **offline**';
			case 'online':
				return mobile === 'online'
					? '<:valet_online_mobile:716070897991155783> **online**'
					: '<:valet_online:716028314334003322> **online**';
		}
	}

	static formatDate(timestamp) {
		let startTime = timestamp;
		let endTime = Date.now();
		let totalSeconds = (endTime - startTime) / 1000;

		let hours = Math.floor(totalSeconds / 3600);
		let minutes = Math.floor((totalSeconds % 3600) / 60);
		let seconds = Math.floor((totalSeconds % 3600) % 60);

		return `${hours >= 1 ? ('0' + hours).slice(-2) + ':' : ''}${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
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
