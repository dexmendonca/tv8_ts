// PM2 CONFIG
module.exports = {
	apps: [
		{
			name: 'tv8_ts',
			script: 'dist/app/server.js',
			instances: 'max',
			exec_mode: 'cluster'
		}
	]
};
