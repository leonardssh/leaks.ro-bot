const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Send a message to a channel through bot.',
			runIn: ['text'],
			permissionLevel: 6,
			usage: '[channel:channel] <message:string> [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [channel = msg.channel, ...message]) {
		if (!channel.postable) {
			throw `I am not allowed to send messages to this channel.`;
		}

		return channel.send(message.join(' '));
	}
};
