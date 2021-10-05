import { promisify } from 'util';
import { randomUUID } from 'crypto';

export default {
	uuidv4: promisify(randomUUID),
	uuidv4Sync: randomUUID,
	randomUUID: promisify(randomUUID),
	randomUUIDSync: randomUUID
};
