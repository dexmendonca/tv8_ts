const parseBool = (val: number | string) => {
	val = `${val}`.toUpperCase();
	let ret = null;
	const trueArr = ['TRUE', '1', 'ON'];
	const falseArr = ['FALSE', '0', 'OFF'];
	if (trueArr.includes(val)) {
		ret = true;
	}
	if (falseArr.includes(val)) {
		ret = false;
	}
	return ret;
};

export default {
	parseBool
};
