import { promisify } from 'util';
import crypto from 'crypto';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config();

const keypassword = process.env.HASH_SECURITY;

const generateKeyPair = async () => {
	try {
		const generateKeyPair = promisify(crypto.generateKeyPair);
		const keys = await generateKeyPair("rsa", {
			// The standard secure default length for RSA keys is 2048 bits
			modulusLength: 4096,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem',
				cipher: 'aes-256-cbc',
				passphrase: keypassword
			}
		});
		return { publicKey: keys.publicKey, privateKey: keys.privateKey };
	} catch (error) {
		return null;
	}
};

const encrypt = async (publicKey:string, data:string) => {
	try {
		const encryptedData = crypto.publicEncrypt(
			{
				key: publicKey,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha256"
			},
			// We convert the data string to a buffer using `Buffer.from`
			Buffer.from(data)
		);
		return encryptedData.toString("base64");
	} catch (error) {
		return null;
	}
};

const decrypt = async (privateKey:string, encryptedData:string) => {
	try {
		const decryptedData = crypto.privateDecrypt(
			{
				key: privateKey,
				// In order to decrypt the data, we need to specify the
				// same hashing function and padding scheme that we used to
				// encrypt the data in the previous step
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha256",
				passphrase: keypassword
			},
			Buffer.from(encryptedData, 'base64')
		);

		// The decrypted data is of the Buffer type, which we can convert to a
		// string to reveal the original data
		return decryptedData.toString();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const sign = (privateKey:string, data:string) => {
	try {
		const signature = crypto.sign("sha256", Buffer.from(data), {
			key: privateKey,
			passphrase: keypassword,
			padding: crypto.constants.RSA_PKCS1_PSS_PADDING
		});

		return signature.toString("base64");
	} catch (error) {
		return null;
	}
};

const verify = (publicKey:string, signature:string, data:string) => {
	try {
		const isVerified = crypto.verify(
			"sha256",
			Buffer.from(data),
			{
				key: publicKey,
				padding: crypto.constants.RSA_PKCS1_PSS_PADDING
			},
			Buffer.from(signature, 'base64')
		);
		return isVerified;
	} catch (error) {
		return null;
	}
};

export default {
	generateKeyPair,
	encrypt,
	decrypt,
	sign,
	verify
};
