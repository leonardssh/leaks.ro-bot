const { Inhibitor, util } = require('klasa');
const { stripIndents } = require('common-tags');
const {
	Permissions,
	Permissions: { FLAGS }
} = require('discord.js');

module.exports = class extends Inhibitor {
	constructor(...args) {
		super(...args);
		this.impliedPermissions = new Permissions([
			'VIEW_CHANNEL',
			'MANAGE_MESSAGES',
			'EMBED_LINKS',
			'ATTACH_FILES',
			'KICK_MEMBERS',
			'BAN_MEMBERS',
			'MANAGE_CHANNELS',
			'ADD_REACTIONS',
			'READ_MESSAGE_HISTORY',
			'MENTION_EVERYONE',
			'MANAGE_ROLES',
			'MANAGE_WEBHOOKS',
			'MANAGE_EMOJIS',
			'CHANGE_NICKNAME'
		]);

		this.friendlyPerms = Object.keys(FLAGS).reduce((obj, key) => {
			obj[key] = util.toTitleCase(key.split('_').join(' '));
			return obj;
		}, {});
	}

	run(message, command) {
		const { requiredPermissions } = command;

		const missing =
			message.channel.type === 'text'
				? message.channel.permissionsFor(this.client.user).missing(requiredPermissions, false)
				: this.impliedPermissions.missing(requiredPermissions, false);

		if (missing.length) {
			if (missing.includes('EMBED_LINKS')) {
				throw stripIndents`<:valet_nope:716348860389261395> ${
					message.author
				}, the bot doesn't have the necessary permissions to execute this command in this channel.\n\n\
		            **REQUIRED PERMISSIONS:**\n\
		            \`\`\`\n${requiredPermissions
						.toArray()
						.map(key => key.replace('_', ' '))
						.join(',\n')}\`\`\`\n\
		            **MISSING PERMISSIONS:**\n\
		            \`\`\`\n${missing.map(key => this.friendlyPerms[key]).join(', ')}\`\`\``;
			}

			throw {
				title: `Insufficient permissions`,
				description: `<:valet_nope:716348860389261395> ${message.author}, the bot doesn't have the necessary permissions to execute this command in this channel.`,
				color: '#e74c3c',
				fields: [
					{
						name: 'Required Permissions:',
						value: `\`\`\`\n${requiredPermissions
							.toArray()
							.map(key => key.replace('_', ' '))
							.join(',\n')}\`\`\``,
						inline: true
					},
					{
						name: 'Missing Permissions:',
						value: `\`\`\`\n${missing.map(key => this.friendlyPerms[key]).join(', ')}\`\`\``,
						inline: true
					}
				]
			};
		}
	}
};
