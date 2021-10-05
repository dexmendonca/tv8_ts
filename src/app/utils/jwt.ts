import dotenvSafe from 'dotenv-safe';
import { createSigner, createVerifier } from 'fast-jwt';

import script from '../scripts/script';

dotenvSafe.config();

const key = process.env.HASH_SECURITY;
const expDuration = script.parseJWTTime(process.env.JWT_DURATION);

const signSync = createSigner({ key: key, expiresIn: expDuration, algorithm: 'HS512' });
const sign = createSigner({ key: async () => key, expiresIn: expDuration, algorithm: 'HS512' });

const verifySyncVerifier = createVerifier({ key: key });
const verifyVerifier = createVerifier({ key: async () => key });

const verify = async (token:string, showPayload = false) => {
	try {
		const payload = await verifyVerifier(token);
		if (showPayload) {
			return { valid: true, payload };
		} else {
			return true;
		}
	} catch (error) {
		if (showPayload) {
			return { valid: false };
		} else {
			return false;
		}
	}
};

const verifySync = (token:string, showPayload = false) => {
	try {
		const payload = verifySyncVerifier(token);
		if (showPayload) {
			return { valid: true, payload };
		} else {
			return true;
		}
	} catch (error) {
		if (showPayload) {
			return { valid: false };
		} else {
			return false;
		}
	}
};
export default {
	signSync,
	sign,
	verifySync,
	verify
};
