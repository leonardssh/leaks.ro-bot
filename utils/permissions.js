const { PermissionLevels } = require('klasa');
const {
	Permissions: { FLAGS }
} = require('discord.js');

module.exports = {
	permissionLevels: new PermissionLevels()
		.add(0, () => true)
		.add(6, ({ guild, member }) => member._roles.includes(guild.settings.moderator), {
			fetch: true
		})
		.add(7, ({ guild, member }) => guild && member.permissions.has(FLAGS.MANAGE_GUILD), { fetch: true })
		.add(8, ({ guild, member }) => guild && member === guild.owner, { fetch: true })
		.add(9, ({ author, client }) => client.owners.has(author), { break: true })
		.add(10, ({ author, client }) => client.owners.has(author))
};
