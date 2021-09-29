const events = [
	{
		eventName: 'appNotification',
		fn: async (data:any) => {
			console.log('Event system ' + JSON.stringify(data));
		}
	}
];

export default events;
