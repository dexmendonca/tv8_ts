import { genericObject } from '../types/genericObjectType';
import testServiceBase from '../services/testService';
const exportFN = (ft:any) => {
	const testService = testServiceBase(ft);
	const EventBus = ft.EventBus;
	const db = ft.knex;

	const testGet = async (req:genericObject, res:genericObject) => {
		const now = await testService.showNow();
		res.code(200).send({ hello: 'test', now, appVersion: res.locals.appVersion, urlData: res.locals.urlData });
	};

	const testPost = async (req:genericObject, res:genericObject) => {
		try {
			const trx = await db.transaction();
			try {
				const result = await trx.raw('SELECT NOW()');
				console.log(result.rows);
				await trx.commit();
				res.code(200).send(req.body);
			} catch (e) {
				await trx.rollback();
				throw e;
			}
		} catch (e) {
			res.code(400).send({ msg: 'error' });
		}
	};

	const testEvent = async (req:genericObject, res:genericObject) => {
		EventBus.emit('appNotification', { hello: 'world' });
		res.code(200).send({});
	};

	const testEventDB = async (req:genericObject, res:genericObject) => {
		try {
			const trx = await db.transaction();
			try {
				await trx.raw(`SELECT * from eventBus.emit('eventTest','{}')`);
				await trx.commit();
				res.code(200).send({});
			} catch (e) {
				await trx.rollback();
				throw e;
			}
		} catch (e) {
			res.code(400).send({ msg: 'error' });
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const testError = async (req:genericObject, res:genericObject) => {
		throw new Error('kaboom');
	};

	return {
		testGet,
		testPost,
		testEvent,
		testEventDB,
		testError
	};
};

export default exportFN;
