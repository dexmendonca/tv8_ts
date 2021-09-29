import dotenvSafe from 'dotenv-safe';

dotenvSafe.config();

const tasksFN:any = (ft:any) => {
	const db = ft.knex;
	const promise = ft.promise;

	const taskList = [];

	taskList.push(
		{
			period: '0,30 * * * *',
			fn: async () => {
				const trx = await promise.promisify(db.transaction);
				try {
					await trx.raw('SELECT NOW()');
					await trx.commit();
					// console.log('Running a task');
				} catch (e) {
					await trx.rollback();
					throw e;
				}
			}
		}
	);

	return taskList;
};

export default tasksFN;
