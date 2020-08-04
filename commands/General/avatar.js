const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			guarded: true,
			description: 'Displays the avatar of the specified user.',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(message) {
		let mentionedUser = message.mentions.users.first() || message.author;

		await message.send('Generating avatar...');
		message.sendEmbed(
			new MessageEmbed()
				.setImage(mentionedUser.avatarURL({ dynamic: true, size: 2048, format: 'png' }))
				.setColor('#008dff')
				.setTitle(`${mentionedUser.username}'s Avatar`)
				.setDescription(
					`[click here for download](${mentionedUser.avatarURL({
						dynamic: true,
						size: 2048,
						format: 'png'
					})})`
				)
		);
	}
};
