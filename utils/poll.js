const { MessageEmbed } = require('discord.js');
const { Duration } = require('klasa');

class Poll {
	constructor(client, msg, user, answers, time, action, reason) {
		if (msg) {
			this.client = client;
			this.guildId = msg.guild.id;
			this.channelId = msg.channel.id;
			this.msgId = null;
			this.user = user;
			this.action = action;
			this.reason = reason;
			this.answers = answers;
			this.createdOn = Date.now();
			this.isTimed = time != 0;
			this.hasFinished = false;
			this.finishTime = time;
			this.emojis = ['👍', '👎'];
			this.finalResults = [];
			this.results = [];
		}
	}

	async start(msg) {
		const message = await msg.sendEmbed(this.generateEmbed());

		this.msgId = message.id;

		for (let i = 0; i < this.answers.length && i < 10; ++i) {
			try {
				await message.react(this.emojis[i]);
			} catch (error) {
				console.log(error);
			}
		}

		return message.id;
	}

	async finish(client) {
		const message = await this.getPollMessage(client);
		const now = new Date();

		if (!message) {
			console.error("Can't find poll message");
			return;
		}

		if (message.embeds.length < 1) {
			console.error('The poll message ha no embeds.');
			return;
		}

		this.hasFinished = true;

		const embed = new MessageEmbed(message.embeds[0])
			.setColor('#008dff')
			.setAuthor(
				`Vote for ${this.user.tag} to be ${this.action === 'ban' ? 'banned' : 'kicked'}! [FINISHED]`,
				this.user.avatarURL({ dynamic: true, size: 2048, format: 'png' })
			)
			.setFooter(`Poll finished ${now.toUTCString()}`);

		try {
			await message.edit({ embed: embed });
			await this.getVotes(message);
			await this.showResults(message.channel);

			if (this.finalResults[0].votes > this.finalResults[1].votes) {
				await message.channel.send(`${this.user}, you have 10 seconds to say goodbye!`);

				setTimeout(async () => {
					switch (this.action) {
						case 'kick':
							await this.client.commands.get('kick').run(message, [this.user, 0, this.reason]);
							break;

						case 'ban':
							await this.client.commands.get('ban').run(message, [this.user, this.reason]);
							break;
					}
				}, 10 * 1000);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async getVotes(message) {
		if (this.hasFinished) {
			const reactionCollection = message.reactions.cache;

			for (let i = 0; i < this.answers.length; i++) {
				this.results[i] = reactionCollection.get(this.emojis[i]).count - 1;
			}
		} else {
			throw new Error('Poll not ended');
		}
	}

	async showResults(message) {
		if (!this.hasFinished) {
			throw new Error('The poll is not finished');
		}

		if (this.results.length < 2) {
			throw new Error('There are no results');
		}

		return await message.sendEmbed(this.generateResultsEmbed());
	}

	generateEmbed() {
		let str = new String();

		for (let i = 0; i < this.answers.length && i < 10; i++) {
			str += `Reacts with ${this.emojis[i]} for ${this.answers[i]}\n`;
		}

		let footer = `React with the emojis below.`;

		if (this.isTimed) {
			footer += ` | This poll ends in ${Duration.toNow(this.finishTime)}`;
		}

		let embed = new MessageEmbed()
			.setColor('#008dff')
			.setAuthor(
				`Vote for ${this.user.tag} to be ${this.action === 'ban' ? 'banned' : 'kicked'}!`,
				this.user.avatarURL({ dynamic: true, size: 2048, format: 'png' })
			)
			.setDescription(str)
			.setFooter(footer);

		return embed;
	}

	generateResultsEmbed() {
		let description = new String();
		let totalVotes = 0;

		this.results.forEach(answer => (totalVotes += answer));
		if (totalVotes == 0) totalVotes = 1;

		let finalResults = [];

		for (let i = 0; i < this.results.length; i++) {
			let percentage = (this.results[i] / totalVotes) * 100;
			let result = {
				emoji: this.emojis[i],
				answer: this.answers[i],
				votes: this.results[i],
				percentage: percentage.toFixed(2)
			};

			finalResults.push(result);
		}

		this.finalResults = [...finalResults];

		finalResults.sort((a, b) => {
			return b.votes - a.votes;
		});

		finalResults.forEach(r => {
			description += `${r.emoji} **${r.votes}** (**${r.percentage}%**) \n`;
		});

		let resultsEmbed = new MessageEmbed()
			.setAuthor(
				`Results for: Vote for ${this.user.tag} to be ${this.action === 'ban' ? 'banned' : 'kicked'}!`,
				this.user.avatarURL({ dynamic: true, size: 2048, format: 'png' })
			)
			.setDescription(description)
			.setColor('#008dff');

		return resultsEmbed;
	}

	async getPollMessage(client) {
		try {
			return await client.guilds.cache.get(this.guildId).channels.cache.get(this.channelId).messages.fetch(this.msgId);
		} catch (err) {
			return;
		}
	}
}

module.exports = { Poll };
