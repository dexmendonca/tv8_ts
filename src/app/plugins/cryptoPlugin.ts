import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import crypto from '../utils/crypto';

const pluginFN = fp((ft: any, opts: FastifyPluginAsync, done:any) => {
	ft.decorate('crypto', crypto);
	done();
});

export default pluginFN;
