require('dotenv').config();

const { BOT_TOKEN, ENVIRONMENT } = process.env;
const { Client, Schema } = require('klasa');

const client = new Client({
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
	gateways: {
		guilds: {
			schema: new Schema()
				.add('disabledCommands', 'command', {
					array: true,
					filter: (client, command, piece, language) => {
						if (command.guarded) throw language.get('COMMAND_CONF_GUARDED', command.name);
					}
				})
				.add('antiInvite', 'boolean', { default: false })
				.add('muted', 'role')
		}
	},
	readyMessage: client => `Successfully initialized. Ready to serve ${client.guilds.cache.size} guilds.`
});

client.login(BOT_TOKEN);
