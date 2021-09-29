import { promisify as prom } from 'util';

const promisifyAll = (mod:any) => {
	const pmod = Object.keys(mod).reduce((acc:any, fn:any) => {
		if (fn.match(/(stream|sync)/gi)) {
			acc[fn] = mod[fn];
		} else {
			try {
				acc[fn + 'Async'] = prom(mod[fn]);
			} catch (err) {
				acc[fn] = mod[fn];
			}
		}
		return acc;
	}, {});
	return pmod;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const promisify = (fn:any) : Promise<any> => new Promise((resolve, reject) => fn(resolve));

export default {
	promisifyAll,
	promisify
};
