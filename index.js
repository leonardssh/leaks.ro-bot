require('dotenv').config();

const { BOT_TOKEN, ENVIRONMENT } = process.env;
const { Client } = require('klasa');

new Client({
	fetchAllMembers: false,
	prefix: ['leaks', 'pls', 'leo pls', 'kenn pls', 'views pls', 'emrys pls', 'krusher pls'],
	commandEditing: true,
	commandLogging: ENVIRONMENT == 'dev',
	typing: true,
	production: ENVIRONMENT == 'prod',
	prefixCaseInsensitive: true,
	consoleEvents: {
		debug: ENVIRONMENT == 'dev',
		error: true,
		log: true,
		verbose: ENVIRONMENT == 'dev',
		warn: true,
		wtf: true
	},
	disabledCorePieces: ['commands'],
	readyMessage: client => `Successfully initialized. Ready to serve ${client.guilds.cache.size} guilds.`
}).login(BOT_TOKEN);
