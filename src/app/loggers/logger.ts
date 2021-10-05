const pino = require('pino');
const fileStreamRotator = require('file-stream-rotator');
const multistream = require('pino-multi-stream').multistream;

const logDirectory = '/tmp/tv8';
const streams = [

	{ stream: fileStreamRotator.getStream({ filename: `${logDirectory}/info-%DATE%.log`, verbose: false, frequency: "72h", max_logs: "10d", date_format: "YYYY-MM-DD" }) },
	{ level: 'info', stream: fileStreamRotator.getStream({ filename: `${logDirectory}/info-%DATE%.log`, verbose: false, frequency: "72h", max_logs: "10d", date_format: "YYYY-MM-DD" }) },
	{ level: 'debug', stream: fileStreamRotator.getStream({ filename: `${logDirectory}/debug-%DATE%.log`, verbose: false, frequency: "72h", max_logs: "10d", date_format: "YYYY-MM-DD" }) },
	{ level: 'warn', stream: fileStreamRotator.getStream({ filename: `${logDirectory}/warn-%DATE%.log`, verbose: false, frequency: "72h", max_logs: "10d", date_format: "YYYY-MM-DD" }) },
	{ level: 'error', stream: fileStreamRotator.getStream({ filename: `${logDirectory}/error-%DATE%.log`, verbose: false, frequency: "72h", max_logs: "10d", date_format: "YYYY-MM-DD" }) },
	{ level: 'fatal', stream: fileStreamRotator.getStream({ filename: `${logDirectory}/fatal-%DATE%.log`, verbose: false, frequency: "72h", max_logs: "10d", date_format: "YYYY-MM-DD" }) }

];

const logger = pino({ level: 'debug', prettyPrint: { translateTime: 'yyyy-mm-dd HH:MM:ss', colorize: true } }, multistream(streams));
export { logger };
