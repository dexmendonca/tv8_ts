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

const parseJWTTime = (time:string | number) => {
	const timeStr :string = `${time}`.toLowerCase();
	let value: number;

	if ((timeStr.endsWith('s')) || (timeStr.endsWith('sec'))) {
		value = parseInt(timeStr) * 1000;
	} else if ((timeStr.endsWith('m')) || (timeStr.endsWith('min'))) {
		value = parseInt(timeStr) * 60000;
	} else if ((timeStr.endsWith('h')) || (timeStr.endsWith('hour')) || (timeStr.endsWith('hours'))) {
		value = parseInt(timeStr) * 3600000;
	} else if ((timeStr.endsWith('day')) || (timeStr.endsWith('days'))) {
		value = parseInt(timeStr) * 86400000;
	} else {
		value = parseInt(`${value}`);
	}
	return value;
};

export default {
	parseBool,
	parseJWTTime
};
