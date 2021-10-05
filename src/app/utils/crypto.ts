import { promisify } from 'util';
import crypto from 'crypto';
import argon2 from 'argon2';
import bcryptjs from 'bcryptjs';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config();

const defaultCryptSystem = `${process.env.CRYPTO_SYSTEM}`.toLowerCase();
const defaultLength = 32;

// CRYPTO_SYSTEM=argon2
const encryptArgon2 = async (password:string) => {
	try {
		const hash = await argon2.hash(password);
		return hash;
	} catch (err) {
		return null;
	}
};

const verifyArgon2 = async (hash:string, password:string) => {
	try {
		if (await argon2.verify(hash, password)) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return null;
	}
};

// CRYPTO_SYSTEM=bcrypt
const encryptBcrypt = async (password:string) => {
	try {
		const salt = await bcryptjs.genSalt(12);
		const hash = await bcryptjs.hash(password, salt);
		return hash;
	} catch (err) {
		return null;
	}
};
const verifyBcrypt = async (hash:string, password:string) => {
	try {
		if (await bcryptjs.compare(password, hash)) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return null;
	}
};

// CRYPTO_SYSTEM=pbkdf2

const encodePbkdf2 = async (password:string, { algorithm, salt, iterations }:any) => {
	const pbkdf2 = promisify(crypto.pbkdf2);
	const hash = await pbkdf2(password, salt, iterations, defaultLength, algorithm);
	return `pbkdf2_${algorithm}$${iterations}$${salt}$${hash.toString('base64')}`;
};

const decodePbkdf2 = (encoded:string) => {
	let [algorithm, iterations, salt, hash] = encoded.split('$');

	algorithm = (algorithm.split('pbkdf2_'))[1];
	return {
		algorithm,
		hash,
		iterations: parseInt(iterations, 10),
		salt
	};
};
const encryptPbkdf2 = async (password:string) => {
	try {
		const algorithm = 'sha256';
		const salt = crypto.randomBytes(64).toString('base64');
		const iterations = 10000;

		const str = await encodePbkdf2(password, { algorithm, salt, iterations });
		return str;
	} catch (err) {
		console.error(err);
		return null;
	}
};

const verifyPbkdf2 = async (hash:string, password:string) => {
	try {
		const decoded = decodePbkdf2(hash);
		const encodedPassword = await encodePbkdf2(password, decoded);
		return hash === encodedPassword;
	} catch (err) {
		console.error(err);
		return null;
	}
};

const encrypt = async (password:string, cryptSystem = defaultCryptSystem) => {
	let hash;
	switch (cryptSystem) {
	case 'argon2':
		hash = await encryptArgon2(password);
		break;
	case 'bcrypt':
		hash = await encryptBcrypt(password);
		break;
	case 'pbkdf2':
		hash = await encryptPbkdf2(password);
		break;

	default:
		hash = await encryptArgon2(password);
		break;
	}
	return hash;
};

const verify = async (hash:string, password:string, cryptSystem = defaultCryptSystem) => {
	let isverify;
	switch (cryptSystem) {
	case 'argon2':
		isverify = await verifyArgon2(hash, password);
		break;
	case 'bcrypt':
		isverify = await verifyBcrypt(hash, password);
		break;
	case 'pbkdf2':
		isverify = await verifyPbkdf2(hash, password);
		break;

	default:
		isverify = await verifyArgon2(hash, password);
		break;
	}
	return isverify;
};

export default {
	encrypt,
	verify
};
