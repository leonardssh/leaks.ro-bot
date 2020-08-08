const { Command } = require('klasa');

const fs = require('fs');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Displays a random joke.',
			runIn: ['text'],
			aliases: ['gluma', 'glumitza', 'dumitza'],
			subcommands: true,
			usage: '[add|pt] [User:user] [Duma:...string]',
			usageDelim: ' '
		});
	}

	async run(message, [user, duma]) {
		let _duma = JSON.parse(fs.readFileSync('dume.json', 'utf8'));

		message.sendMessage(_duma[Math.floor(Math.random() * _duma.length)]);
	}

	async add(message, [user, duma]) {
		if (!(await message.hasAtLeastPermissionLevel(7))) {
			return this.run(message, [user, duma]);
		}

		if (!duma) {
			throw `You forgot to introduce the joke.`;
		}

		fs.readFile('dume.json', (err, data) => {
			if (err) {
				console.error(err);
			}

			let json = JSON.parse(data);

			if (json.includes(duma)) {
				return message.reply(`This joke already exists.`);
			}

			json.push(duma);

			fs.writeFile('dume.json', JSON.stringify(json), err => {
				if (err) {
					console.error(err);
				}

				message.sendMessage('Joke added successfully! :sunglasses:');
			});
		});
	}

	async pt(message, [user, duma]) {
		let mentionedUser = user || null;
		let _duma = JSON.parse(fs.readFileSync('dume.json', 'utf8'));

		message.sendMessage(`${mentionedUser !== null ? `${mentionedUser} ➝ ` : ''} ` + _duma[Math.floor(Math.random() * _duma.length)]);
	}
};
