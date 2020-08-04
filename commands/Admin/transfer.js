const { Command } = require('klasa');
const fs = require('fs-nextra');
const { resolve, join } = require('path');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_TRANSFER_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(message, [piece]) {
		const file = join(...piece.file);
		const fileLocation = resolve(piece.directory, file);

		await fs.access(fileLocation).catch(() => {
			throw message.language.get('COMMAND_TRANSFER_ERROR');
		});

		try {
			await fs.copy(fileLocation, join(piece.store.userDirectory, file));

			piece.store.load(piece.store.userDirectory, piece.file);

			return message.sendLocale('COMMAND_TRANSFER_SUCCESS', [piece.type, piece.name]);
		} catch (err) {
			this.client.emit('error', err.stack);
			return message.sendLocale('COMMAND_TRANSFER_FAILED', [piece.type, piece.name]);
		}
	}
};
