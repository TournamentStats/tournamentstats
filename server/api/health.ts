export default defineEventHandler({
	onBeforeResponse: [
		logAPI,
	],
	handler: (event) => {
		setHeader(event, 'content-type', 'application/json');
		return '200';
	},
});
