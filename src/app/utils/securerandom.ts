import crypto from 'crypto';
import util from 'util';

const randomBytesAsync = util.promisify(crypto.randomBytes);

class RandomGenerationError extends Error {
	constructor (message : string) {
		super(message);
		this.name = 'RandomGenerationError';
	}
}

const calculateParameters = (range:number) => {
	let bitsNeeded = 0;
	let bytesNeeded = 0;
	let mask = 1;

	while (range > 0) {
		if (bitsNeeded % 8 === 0) {
			bytesNeeded += 1;
		}

		bitsNeeded += 1;
		mask = mask << 1 | 1;
		range = range >>> 1;
	}

	return { bitsNeeded: bitsNeeded, bytesNeeded: bytesNeeded, mask: mask };
};

async function secureRandomNumber (minimum: number, maximum: number): Promise<number> {
	const maxInt = Number.MAX_SAFE_INTEGER;
	const minInt = Number.MIN_SAFE_INTEGER;

	if (minimum == null) {
		throw new RandomGenerationError('You must specify a minimum value.');
	}

	if (maximum == null) {
		throw new RandomGenerationError('You must specify a maximum value.');
	}

	if (minimum % 1 !== 0) {
		throw new RandomGenerationError('The minimum value must be an integer.');
	}

	if (maximum % 1 !== 0) {
		throw new RandomGenerationError('The maximum value must be an integer.');
	}

	if (!(maximum > minimum)) {
		throw new RandomGenerationError('The maximum value must be higher than the minimum value.');
	}

	if (minimum < minInt || minimum > maxInt) {
		throw new RandomGenerationError('The minimum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.');
	}

	if (maximum < minInt || maximum > maxInt) {
		throw new RandomGenerationError('The maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.');
	}

	const range = maximum - minimum;

	if (range < minInt || range > maxInt) {
		throw new RandomGenerationError('The range between the minimum and maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.');
	}

	const _calculateParameters = calculateParameters(range);

	const bytesNeeded = _calculateParameters.bytesNeeded;
	const mask = _calculateParameters.mask;

	const randomBytes = await randomBytesAsync(bytesNeeded);

	let randomValue = 0;

	for (let i = 0; i < bytesNeeded; i++) {
		randomValue |= randomBytes[i] << 8 * i;
	}

	randomValue = randomValue & mask;

	if (randomValue <= range) {
		return minimum + randomValue;
	} else {
		return secureRandomNumber(minimum, maximum);
	}
}

module.exports = secureRandomNumber;
