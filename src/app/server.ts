import fs from 'fs';
import path from 'path';
import dotenvSafe from 'dotenv-safe';
import knex from 'knex';
import chokidar from 'chokidar';
import fastify from 'fastify';
import helmet from 'fastify-helmet';
import cors from 'fastify-cors';

import { genericObject } from './types/genericObjectType';
import script from './script/script';
import databaseConfig from './config/database';

// configuração do DB
import ffyFormBody from 'fastify-formbody';
import ffyUrlData from 'fastify-url-data';

import promisePlugin from './plugins/promisePlugin';
import eventBusPlugin from './plugins/EventBusPlugin';
import eventBusDBPlugin from './plugins/EventBusDBPlugin';
import cronPlugin from './plugins/cronPlugin';

dotenvSafe.config();

const NODE_ENV = `${process.env.NODE_ENV}`.toLowerCase();
const serverMode = `${process.env.SERVER_MODE}`.toLowerCase();
const httpMode = `${process.env.HTTP_MODE}`.toLowerCase();

const configHTTP = {
	trustProxy: true,
	logger: false
};

let port;
let objConfig: genericObject = {};

if (serverMode === 'http') {
	objConfig = configHTTP;
	port = process.env.PORT_HTTP;
} else {
	const configHTTPS = {
		http2: true,
		trustProxy: true,
		logger: false,
		https: {
			allowHTTP1: true, // fallback support for HTTP1
			key: fs.readFileSync(path.resolve(__dirname, process.env.HTTPS_KEY)),
			cert: fs.readFileSync(path.resolve(__dirname, process.env.HTTPS_CERT))
		}
	};
	objConfig = configHTTPS;
	port = process.env.PORT_HTTPS;

	if (httpMode === 'block') {
		const serverHttp = fastify(configHTTP);
		serverHttp.route({
			method: ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS'],
			url: '*',
			handler: function (request, reply) {
				reply.status(403).send({ msg: 'Nenhuma solicitação HTTP é permitida' });
			}
		});
		serverHttp.listen(process.env.PORT_HTTP, () => {
			console.log('servidor rodando http');
		});
	}
}

if (script.parseBool(process.env.USE_LOGGER)) {
	const loggerDir = '/tmp/tv8';
	if (!fs.existsSync(loggerDir)) {
		fs.mkdirSync(loggerDir);
	}
	const watcher = chokidar.watch('/tmp', {
		ignored: /(^|[/\\])\../, // ignore dotfiles
		persistent: true
	});
	watcher.on('unlinkDir', path => {
		if (path === '/tmp/tv8') {
			if (!fs.existsSync(loggerDir)) {
				fs.mkdirSync(loggerDir);
			}
		}
	}).on('error', () => null);

	const logger = require('./logger/logger').logger;
	objConfig.logger = logger;
}

const server = fastify(objConfig);
const dbConfig = databaseConfig[NODE_ENV];

server.register(require('fastify-knex'), dbConfig);
server.register(require('fastify-favicon'), { path: path.resolve(__dirname, './public'), name: 'favicon.ico' });

server.register(helmet);
server.register(cors);
server.register(ffyFormBody);
server.register(require('fastify-axios'));
server.register(ffyUrlData);
server.register(promisePlugin);

// Plugins Customizados
if (script.parseBool(process.env.USE_EVENT)) {
	server.register(eventBusPlugin);
}
if (script.parseBool(process.env.USE_EVENTDB)) {
	server.register(eventBusDBPlugin);
}
if (script.parseBool(process.env.USE_CRON)) {
	server.register(cronPlugin);
}

// configuração do global
server.decorateReply('locals', null);
server.addHook('preHandler', function (req: any, reply: any, next) {
	reply.locals = {};

	const { name, version } = require('../package.json');
	// cadastre a partir daqui
	reply.locals.appVersion = version;
	reply.locals.appName = name;
	reply.locals.nodeEnv = NODE_ENV;
	reply.locals.urlData = req.urlData();
	next();
});
server.register(require('./routes/_routes'), { prefix: '/' });

server.setErrorHandler(function (error, request, reply) {
	// Log error
	request.log.error(error);
	// Send error response
	reply.status(500).send({
		msg: 'Um erro ocorreu'
	});
});

const checkDB = async () => {
	try {
		const db = knex(dbConfig);
		await db.raw('SELECT NOW()');
		await db.destroy();
		return 'DB: ON';
	} catch (error) {
		return 'DB: OFF';
	}
};

server.listen(port, '0.0.0.0', async (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
	console.log(await checkDB());
});
