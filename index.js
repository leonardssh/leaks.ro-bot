require('dotenv').config();
require('./prototypes');

const { Client } = require('klasa');

const options = require('./utils/options');
const client = new Client(options);

client.login(process.env.BOT_TOKEN);
