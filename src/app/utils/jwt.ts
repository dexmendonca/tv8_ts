import dotenvSafe from 'dotenv-safe';
import jwt from 'jsonwebtoken';

dotenvSafe.config();

const secret = process.env.HASH_SECURITY;
const duration = process.env.JWT_DURATION;

const sign = async (data: unknown) => {
	return (
		await jwt.sign({ data: data }, secret, { expiresIn: duration })
	);
};

const verify = async (token: string) => {
	try {
		const decoded = await jwt.verify(token, secret);
		if (decoded) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		// err
		return false;
	}
};

export default {
	sign,
	verify
};
