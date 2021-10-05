import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import jwt from '../utils/jwt';

const pluginFN = fp((ft: any, opts: FastifyPluginAsync, done:any) => {
	ft.decorate('jwt', jwt);
	done();
});

export default pluginFN;
