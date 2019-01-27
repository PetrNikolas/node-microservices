//------------------------------------------------------------------------------
// Import all packages
//------------------------------------------------------------------------------
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as logger from 'morgan'
import * as cors from 'cors'

/** Lib for versioned routes */
const totoro = require('totoro-node')

/** Services */
import EmailsService from './services/mails/emailsService'

//------------------------------------------------------------------------------
// New Express server config
//------------------------------------------------------------------------------
class App {
	/** Define variables */
	public express: express.Application
	public bodyParser: any
	public cors: any

	/** Create a new express server */
	constructor() {
		this.express = express()
		this.middleware()
		this.cors = cors()
		this.bodyParser = bodyParser.json()
		this.routes()
	}

	/** Configure Express middleware */
	private middleware(): void {
		this.express.use(logger('dev'))
		this.express.use(bodyParser.json())
		this.express.use(compression())
		this.express.use(bodyParser.urlencoded({ extended: false }))
	}

	/** Create a new routes */
	private routes(): void {
		const router = express.Router()

		/** Simple routes */
		router.get('/', (req, res) => {
			res.send('Node.js project for microservices written in Typescript.')
		})
		router.get('/healtz', (req, res) => {
			res.send('The services are running successfully!')
		})

		/** Non versioned routes */
		this.express.use('/', router)

		/** Versioned routes */
		this.express.use(
			'/api',
			totoro.rain({
				/** This is an API version definition */
				v1: {
					active: true,
					deprecated: false,
					endpoints: [
						{
							route: '/send_email',
							method: 'POST',
							active: true,
							deprecated: false,
							implementation: EmailsService,
						},
					],
				},
			})
		)
	}
}

//------------------------------------------------------------------------------
// Export class with Express config
//------------------------------------------------------------------------------
export default new App().express
