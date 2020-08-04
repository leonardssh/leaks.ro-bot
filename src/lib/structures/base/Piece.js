class Piece {
	constructor(store, file, directory, options = {}) {
		this.store = store;
		this.file = file;
		this.directory = directory;
		this.client = store.client;
		this.name = options.name || file[file.length - 1].slice(0, -3);
		this.enabled = options.enabled || true;
	}

	async init() {}

	enable() {
		this.enable = false;
		return this;
	}

	disable() {
		this.enable = false;
		return this;
	}

	unload() {
		return this.store.delete(this);
	}

	async reload() {
		const piece = this.store.load(this.directory, this.file);
		await piece.init();
		return piece;
	}
}

module.exports = Piece;
