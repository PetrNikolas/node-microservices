//------------------------------------------------------------------------------
// Import all packages
//------------------------------------------------------------------------------
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as cors from 'cors'

/** Node mailer libs */
import * as nodemailer from 'nodemailer'
const smtpTransport = require('nodemailer-smtp-transport')

/** Lib for versioned routes */
const totoro = require('totoro-node')

//------------------------------------------------------------------------------
// New Express server config
//------------------------------------------------------------------------------
class App {
	/** Define variables */
	public express: express.Application
	public bodyParser: any
	public cors: any
	public nodemailer: any
	public smtpTransport: any

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
		this.express.use(bodyParser.urlencoded({ extended: false }))
	}

	private sendEmail(apiVersion: any, req: any, res: any, next: any) {
		/** Sending emails via Nodemailer */
		const transport = nodemailer.createTransport(
			smtpTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				port: 465,
				secure: true, // secure:true for port 465, secure:false for port 587
				auth: {
					type: 'login',
					user: 'YOUR-USER-EMAIL',
					pass: 'YOUR-PASSWORD',
				},
			})
		)

		const mailOptions = {
			from: 'example@gmail.com',
			to: req.body.email,
			subject: req.body.subject,
			html: req.body.content,
		}

		transport.sendMail(mailOptions, function(error, info) {
			if (error) {
				res.json({ code: 'error', msg: error })
			} else {
				res.json({ code: 'success', msg: 'Message sent, thank you!' })
			}
		})
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
							implementation: this.sendEmail,
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
