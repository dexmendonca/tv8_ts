import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import testRoute from './testRoute';

const Route = (fastify:FastifyInstance, opts:FastifyPluginOptions, next:any) => {
	fastify.get<any>('/', (req, res:any) => {
		res.code(200).send({ name: `${res.locals.appName} v${res.locals.appVersion}`, status: 'ON' });
	});

	fastify.register(testRoute, { prefix: '/test' });

	next();
};

export default Route;
