const { Monitor } = require('klasa');
const { remove } = require('confusables');

module.exports = class extends Monitor {
	constructor(...args) {
		super(...args, {
			ignoreOthers: false,
			ignoreBots: false,
			ignoreEdits: false
		});
	}

	async run(message) {
		if (!message.guild) {
			return;
		}

		const { content } = message;

		if (!content || !content.length) {
			return;
		}

		const cleanContent = this.sanitize(content);
		const filteredWords = message.guild.settings.get('filteredWords');

		if (!filteredWords || !filteredWords.length) {
			return;
		}

		const hitTheFilter = filteredWords.find(word => cleanContent.includes(this.sanitize(word)));

		if (!hitTheFilter) {
			return;
		}

		message.delete();
	}

	sanitize(str) {
		return remove(str).toUpperCase();
	}
};
