import dotenvSafe from 'dotenv-safe';

dotenvSafe.config();

const eventFN:any = (ft:any) => {
	const db = ft.knex;

	const eventTest = async (payload:any) => {
		try {
			const trx = await db.transaction();
			try {
				await trx.raw(`SELECT * from eventBus.emit('aftereventTest','${JSON.stringify(payload)}')`);
				await trx.commit();
			} catch (e) {
				await trx.rollback();
				throw e;
			}
		} catch (e) {
			console.error(e);
			console.error('Event Failed');
		}
	};

	const aftereventTest = async (payload:any) => {
		console.log('Event aftereventTest', payload);
	};

	return {
		eventTest,
		aftereventTest
	};
};

export default eventFN;
