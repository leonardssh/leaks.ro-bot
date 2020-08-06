const { ENVIRONMENT } = process.env;
const { gateways } = require('./gateways');
const { permissionLevels } = require('./permissions');

module.exports = {
	presence: {
		activity: {
			name: 'leaks help | @leaks',
			type: 'LISTENING'
		}
	},
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
	disabledCorePieces: ['commands', 'languages'],
	gateways,
	permissionLevels,
	readyMessage: client => `Successfully initialized. Ready to serve ${client.guilds.cache.size} guilds.`,
	autoReconnect: true,
	messageCacheMaxSize: 10,
	messageCacheLifetime: 30,
	messageSweepInterval: 35
};
