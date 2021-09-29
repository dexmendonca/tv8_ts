const exportFN = (ft:any) => {
	const db = ft.knex;
	const promise = ft.promise;

	const showNow = async () => {
		const trx = await promise.promisify(db.transaction);
		try {
			const result = await trx.raw('SELECT NOW()');
			await trx.commit();
			return result.rows;
		} catch (e) {
			await trx.rollback();
			throw e;
		}
	};

	return {
		showNow
	};
};

export default exportFN;