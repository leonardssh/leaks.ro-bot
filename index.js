require('dotenv').config();

const { BOT_TOKEN } = process.env;
const { Client } = require('klasa');

new Client({
	fetchAllMembers: false,
	prefix: ['leaks', 'pls', 'leo pls', 'kenn pls', 'views pls', 'emrys pls', 'krusher pls'],
	commandEditing: true,
	typing: true,
	production: true,
	prefixCaseInsensitive: true,
	readyMessage: client => `Successfully initialized. Ready to serve ${client.guilds.cache.size} guilds.`
}).login(BOT_TOKEN);
