import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import dbEvent from '../events/db/dBEvents';

const pluginFN = fp(async (ft: any, opts: FastifyPluginAsync, done:any) => {
	const db = ft.knex;
	const Event = dbEvent(ft);
	console.log('Escutando Eventos do DB');

	const connection = await db.client.acquireConnection();

	for (const eventName of Object.keys(Event)) {
		connection.query(`LISTEN "${eventName}"`);
	}

	connection.on('notification', async (msg:any) => {
		await Event[msg.channel](JSON.parse(msg.payload));
	});

	done();
});

export default pluginFN;
