import crypto from '../utils/crypto';
import rsa from '../utils/rsa';

const exportFN = (ft:any) => {
	const db = ft.knex;
	const jwt = ft.jwt;

	const showNow = async () => {
		const trx = await db.transaction();
		try {
			const result = await trx.raw('SELECT NOW()');
			await trx.commit();
			return result.rows;
		} catch (e) {
			await trx.rollback();
			throw e;
		}
	};

	const testJWT = async () => {
		const payload = { abc: 123 };
		const sign = await jwt.sign(payload);
		const signsync = jwt.signSync(payload);

		const verify = await jwt.verify(sign);
		const verifysync = jwt.verifySync(signsync);
		const verifye = await jwt.verify(sign + 'e');
		const verifysynce = jwt.verifySync(signsync + 'e');

		return {
			sign,
			signsync,
			verify,
			verifysync,
			verifye,
			verifysynce
		};
	};

	const testCrypto = async () => {
		const password = 'admin123';

		const hasha2 = await crypto.encrypt(password, 'argon2');
		const isverifya2 = await crypto.verify(hasha2, password, 'argon2');

		const hashbc = await crypto.encrypt(password, 'bcrypt');
		const isverifybc = await crypto.verify(hashbc, password, 'bcrypt');

		const hashpb = await crypto.encrypt(password, 'pbkdf2');
		const isverifypb = await crypto.verify(hashpb, password, 'pbkdf2');

		return {
			password,
			argon2: {
				hash: hasha2,
				isverify: isverifya2,
				len: hasha2.length
			},
			bcrypt: {
				hash: hashbc,
				isverify: isverifybc,
				len: hashbc.length
			},
			pbkdf2: {
				hash: hashpb,
				isverify: isverifypb,
				len: hashpb.length
			}

		};
	};

	const testRSA = async () => {
		const secret = 'segredo';
		const verifiableData = "this need to be verified";

		const generateKeyPair = await rsa.generateKeyPair();
		const encrypt = await rsa.encrypt(generateKeyPair.publicKey, secret);
		const decrypt = await rsa.decrypt(generateKeyPair.privateKey, encrypt);
		const sign = await rsa.sign(generateKeyPair.privateKey, verifiableData);

		const verify = await rsa.verify(generateKeyPair.publicKey, sign, verifiableData);
		return {
			encrypt,
			decrypt,
			sign,
			verify,
			generateKeyPair

		};
	};

	return {
		showNow,
		testJWT,
		testRSA,
		testCrypto
	};
};

export default exportFN;
