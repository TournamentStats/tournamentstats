export default defineNitroPlugin((nitroApp) => {
	console.log('setup')
	nitroApp.hooks.hook('error', (error) => {
		logger.error('unhandled exception', { section: 'error-hook', payload: error })
	})
})
