const { MessageEmbed } = require('discord.js');

module.exports = class ModLog {
	constructor(guild) {
		this.client = guild.client;
		this.guild = guild;

		this._type = null;
		this._user = null;
		this._moderator = null;
		this._reason = null;
		this._case = null;
	}

	set type(type) {
		this._type = type;
	}

	get type() {
		return this._type;
	}

	set user(user) {
		this._user = {
			id: user.id,
			tag: user.tag,
			avatar: user.avatarURL({ dynamic: true, size: 2048, format: 'png' })
		};
	}

	get user() {
		return this._user;
	}

	set moderator(user) {
		this._moderator = {
			id: user.id,
			tag: user.tag,
			avatar: user.avatarURL({ dynamic: true, size: 2048, format: 'png' })
		};
	}

	get moderator() {
		return this._moderator;
	}

	set reason(reason = null) {
		if (reason instanceof Array) {
			reason = reason.join(' ');
		}

		this._reason = reason;
	}

	get reason() {
		return this._reason;
	}

	async send() {
		const channel = this.guild.channels.cache.get(this.guild.settings.channels.modlog);

		if (!channel) {
			throw 'The modlog channel does not exist, did it get deleted?';
		}

		await this.getCase();
		return channel.send({ embed: this.embed });
	}

	get embed() {
		const embed = new MessageEmbed()
			.setAuthor(`[${this.type.toUpperCase()}] ${this.user.tag} (${this.user.id})`, this.user.avatar)
			.setColor(ModLog.colour(this.type))
			.setDescription([
				`**Moderator:** ${this.moderator.tag} (${this.moderator.id})`,
				`**Reason:** ${this.reason || `No reason specified, write \`reason ${this.case}\` to claim this log.`}`
			])
			.setFooter(`Case #${this.case}`)
			.setTimestamp();

		return embed;
	}

	async getCase() {
		this.case = this.guild.settings.modlogs.length;

		const { errors } = await this.guild.settings.update('modlogs', this.pack);

		if (errors.length) {
			throw errors[0];
		}

		return this.case;
	}

	get pack() {
		return {
			type: this.type,
			user: this.user.id,
			moderator: this.moderator.id,
			reason: this.reason,
			case: this.case
		};
	}

	static colour(type) {
		switch (type) {
			case 'ban': {
				return 16724253;
			}

			case 'unban': {
				return 1822618;
			}

			case 'warn': {
				return 16564545;
			}

			case 'kick': {
				return 16573465;
			}

			case 'softban': {
				return 15014476;
			}

			case 'mute': {
				return 16758059;
			}

			case 'unmute': {
				return 5570397;
			}

			default: {
				return 16777215;
			}
		}
	}
};
