import fp from 'fastify-plugin';
import dayjs from 'dayjs';
import datefns from 'date-fns';
import { FastifyPluginAsync } from 'fastify';

const pluginFN = fp((ft: any, opts: FastifyPluginAsync, done:any) => {
	ft.decorate('date', dayjs);
	ft.decorate('datefns', datefns);

	done();
});

export default pluginFN;
