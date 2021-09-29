import nodecron from 'node-cron';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import tasksListBase from '../tasks/_tasks';

const pluginFN = fp((ft: any, opts: FastifyPluginAsync, done:any) => {
	ft.decorate('cron', nodecron);
	console.log('Registrando Cron');
	const tasksList = tasksListBase(ft);

	for (const task of tasksList) {
		if (ft.cron.validate(task.period)) {
			ft.cron.schedule(task.period, task.fn);
		}
	}

	done();
});

export default pluginFN;
