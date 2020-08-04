const { Store } = require('@lks/structures/base');
const { Collection } = require('discord.js');

class AliasStore extends Store {
	constructor(...args) {
		super(...args);

		this.aliases = new Collection();
	}

	get(name) {
		return super.get(name) || this.aliases.get(name);
	}

	has(name) {
		return super.has(name) || this.aliases.has(name);
	}

	set(piece) {
		const aliasPiece = super.set(piece);

		if (!aliasPiece) {
			return undefined;
		}

		for (const alias of aliasPiece.aliases) {
			this.aliases.set(alias, aliasPiece);
		}

		return aliasPiece;
	}

	delete(piece) {
		const aliasPiece = this.resolve(piece);

		if (!aliasPiece) {
			return false;
		}

		for (const alias of aliasPiece.aliases) {
			this.aliases.delete(alias);
		}

		return super.delete(aliasPiece);
	}

	clear() {
		super.clear();
		this.aliases.clear();
	}
}

module.exports = AliasStore;
