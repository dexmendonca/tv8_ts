import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import rsa from '../utils/rsa';

const pluginFN = fp((ft: any, opts: FastifyPluginAsync, done:any) => {
	ft.decorate('rsa', rsa);
	done();
});

export default pluginFN;
