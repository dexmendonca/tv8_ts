import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import promise from '../utils/promise';

const pluginFN = fp((ft: any, opts: FastifyPluginAsync, done:any) => {
	ft.decorate('promise', promise);

	done();
});

export default pluginFN;
