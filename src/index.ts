//------------------------------------------------------------------------------
// Import all packages
//------------------------------------------------------------------------------
import * as http from 'http'
import * as debug from 'debug'
import app from './app'

//------------------------------------------------------------------------------
// Debug function
//------------------------------------------------------------------------------
debug('ts-express:server')

//------------------------------------------------------------------------------
// Error handling
//------------------------------------------------------------------------------
function error(error: NodeJS.ErrnoException): void {
	if (error.syscall !== 'listen') throw error

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`)
			process.exit(1)
			break

		case 'EADDRINUSE':
			console.error(`${bind} is already in use`)
			process.exit(1)
			break

		default:
			throw error
	}
}

//------------------------------------------------------------------------------
// Listening handling
//------------------------------------------------------------------------------
function listening(): void {
	const addr = server.address()
	const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`

	debug(`Listening on ${bind}`)
}

//------------------------------------------------------------------------------
// Setup port
//------------------------------------------------------------------------------
const port = process.env.PORT || 3000
app.set('port', port)

//------------------------------------------------------------------------------
// Start server
//------------------------------------------------------------------------------
const server = http.createServer(app)
server.listen(port, (err: any) => {
	/** Error message */
	if (err) {
		return console.log(err)
	}

	/** Success server running */
	return console.log(`Server running at http://127.0.0.1:${port}`)
})
server.on('error', error)
server.on('listening', listening)
