const toFixed = (num:number, decimalPlaces = 0) => {
	const d = decimalPlaces || 0;
	const m = Math.pow(10, decimalPlaces);
	const n = +(decimalPlaces ? num * m : num).toFixed(8); // Avoid rounding errors
	const i = Math.floor(n);
	const f = n - i;
	const e = 1e-8;
	const r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 === 0) ? i : i + 1) : Math.round(n);
	return d ? r / m : r;
};

const mean = (numbers: number[]) => {
	let acc = 0;
	const total = numbers.length;
	for (let i = 0; i < total; i++) {
		acc += numbers[i];
	}
	return acc / total;
};

const median = (numbers: number[]) => {
	let median = 0;
	const numsLen = numbers.length;
	numbers.sort();

	if (numsLen % 2 === 0) {
		median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
	} else {
		median = numbers[(numsLen - 1) / 2];
	}

	return median;
};

const mode = (numbers: number[]) => {
	const modes = [];
	const count:number[] = [];

	const total = numbers.length;

	let maxIndex = 0;

	for (let i = 0; i < total; i++) {
		const number = numbers[i];
		count[number] = (count[number] || 0) + 1;
		if (count[number] > maxIndex) {
			maxIndex = count[number];
		}
	}

	for (const i in count) {
		if (Object.prototype.hasOwnProperty.call(count, i)) {
			if (count[i] === maxIndex) {
				modes.push(Number(i));
			}
		}
	}

	return modes;
};

const range = (numbers: number[]) => {
	numbers.sort();
	return [numbers[0], numbers[numbers.length - 1]];
};

const variance = (numbers: number[]) => {
	const total = numbers.length;
	const avg = mean(numbers);
	let vari = 0;
	for (let i = 0; i < total; i++) {
		vari += Math.pow(numbers[i] - avg, 2);
	}
	return vari / total;
};

const stdDeviation = (numbers: number[]) => {
	const vari = variance(numbers);
	return Math.sqrt(vari);
};

export default {
	toFixed,
	mean,
	median,
	mode,
	range,
	variance,
	stdDeviation
};
