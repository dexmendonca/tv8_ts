import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import uuid from '../utils/uuid';

const pluginFN = fp((ft: any, opts: FastifyPluginAsync, done:any) => {
	ft.decorate('uuid', uuid);
	done();
});

export default pluginFN;
