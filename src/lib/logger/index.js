const moment = require('moment');
const color = require('chalk');
const { inspect } = require('util');

class Logger {
	constructor(client) {
		this.client = client;
	}

	get timestamp() {
		return moment().format('YYYY-MM-DD HH:mm:ss');
	}

	get getContentTypes() {
		return {
			time: timestamp => `${timestamp}`,
			format: (type, _hex) => `${color.hex(_hex)(type)}`,
			message: output => `${output}`
		};
	}

	write(content, type = 'info') {
		content = Logger.parseData(content);

		const { time, format, message } = this.getContentTypes;
		const { hex } = Logger.ColorTypes[type];
		const timestamp = time(color.gray(`${this.timestamp}`));

		return console.log(
			content
				.split('\n')
				.map(output => `${timestamp} ${format(type, hex)}\x1b[0m ${message(output)}`)
				.join('\n')
		);
	}

	static parseData(content) {
		if (Array.isArray(content)) {
			return content.map(Logger.parseData).join('\n');
		}

		if (typeof content === 'object' && content !== null) {
			return inspect(content, { depth: null, colors: true });
		}

		if (content && content.constructor === Error) {
			return content.stack || content.message || String(content);
		}

		return String(content);
	}

	info(...data) {
		this.write(data, 'info');
	}

	error(...data) {
		this.write(data, 'error');
	}

	warn(...data) {
		this.write(data, 'warn');
	}

	log(...data) {
		this.write(data, 'log');
	}

	broh(...data) {
		this.write(data, 'broh');
	}
}

Logger.ColorTypes = {
	info: {
		hex: '#3dd47f'
	},
	error: {
		hex: '#d55170'
	},
	warn: {
		hex: '#f8ff3b'
	},
	log: {
		hex: '#6480bf'
	},
	broh: {
		hex: '#fc38ff'
	}
};

module.exports = Logger;
