import { EventEmitter } from 'events';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import eventList from '../events/system/Events';

const eventEmitter = new EventEmitter();

const pluginFN = fp((ft: any, opts: FastifyPluginAsync, done:any) => {
	ft.decorate('EventBus', eventEmitter);

	console.log('Registrando eventos');

	for (const event of eventList) {
		ft.EventBus.on(`${event.eventName}`, event.fn);
	}

	done();
});

export default pluginFN;
