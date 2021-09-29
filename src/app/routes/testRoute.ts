import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import testControllerBase from '../controllers/testController';

const Route = (fastify:FastifyInstance, opts:FastifyPluginOptions, next:any) => {
	const testController = testControllerBase(fastify);

	fastify.get<any>('/', testController.testGet);
	fastify.post<any>('/', testController.testPost);

	fastify.get<any>('/event', testController.testEvent);
	fastify.get<any>('/eventDB', testController.testEventDB);
	fastify.get<any>('/error', testController.testError);

	fastify.get<any>('/ip', (req, res) => {
		res.code(200).send({
			ip: req.ip,
			ips: req.ips,
			ipRemote: req.raw.connection.remoteAddress
		});
	});

	next();
};

export default Route;
