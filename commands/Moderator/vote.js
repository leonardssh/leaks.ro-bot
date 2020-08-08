const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { Poll } = require('../../utils/poll');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Proposes the voting of a mentioned user.',
			runIn: ['text'],
			subcommands: true,
			permissionLevel: 7,
			usage: '<ban|kick> <User:user> <Time:time> [Reason:...string]',
			usageDelim: ' '
		});
	}

	async ban(message, [user, time, reason]) {
		const poll = await new Poll(this.client, message, user, ['yes', 'no'], time, 'ban', reason);

		let duration = Math.abs(Date.now() - time);

		await poll.start(message);

		setTimeout(() => {
			poll.finish(this.client);
		}, duration);
	}

	async kick(message, [user, time, reason]) {
		const poll = await new Poll(this.client, message, user, ['yes', 'no'], time, 'kick', reason);

		let duration = Math.abs(Date.now() - time);

		await poll.start(message);

		setTimeout(() => {
			poll.finish(this.client);
		}, duration);
	}
};
