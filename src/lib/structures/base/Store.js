const { Collection } = require('discord.js');
const { join, extname, relative, sep } = require('path');
const fs = require('fs-nextra');

class Store extends Collection {
	constructor(client, name, holds) {
		super();

		this.client = client;
		this.name = name;
		this.holds = holds;
	}

	get directory() {
		return join(this.client.baseDirectory, this.name);
	}

	init() {
		return Promise.all(this.map(piece => (piece.enabled ? piece.init() : piece.unload())));
	}

	set(piece) {
		if (!(piece instanceof this.holds)) {
			throw new TypeError(`Only ${this} may be stored in this Store.`);
		}

		const existing = this.get(piece.name);

		if (existing) {
			this.delete(existing);
		}

		super.set(piece.name, piece);
		return piece;
	}

	delete(name) {
		const piece = this.resolve(name);

		if (!piece) {
			return false;
		}

		super.delete(piece.name);
		return true;
	}

	resolve(name) {
		if (name instanceof this.holds) {
			return name;
		}

		return this.get(name);
	}

	load(directory, file) {
		const filePath = join(directory, ...file);

		let piece = null;

		try {
			const Piece = (req => req.default || req)(require(filePath));
			const is_class =
				typeof Piece === 'function' && typeof Piece.prototype === 'object' && Piece.toString().substring(0, 5) === 'class';

			if (!is_class) {
				throw new TypeError('The exported structure is not a class.');
			}

			piece = this.set(new Piece(this, file, directory));
		} catch (errorMsg) {
			this.client.logger.broh(`Failed to load file '${filePath}'. Error:\n${error.stack || error}`);
		}

		delete require.cache[filePath];
		module.children.pop();
		return piece;
	}

	async loadAll() {
		this.clear();
		await Store.walk(this);
		return this.size;
	}

	static async walk(store, directory = store.directory) {
		const files = await fs.scan(directory, { filter: (stats, path) => stats.isFile() && extname(path) === '.js' }).catch(() => {
			fs.ensureDir(directory).catch(err => store.client.logger.error(err));
		});

		if (!files) {
			return true;
		}

		return Promise.all([...files.keys()].map(file => store.load(directory, relative(directory, file).split(sep))));
	}
}

module.exports = Store;
