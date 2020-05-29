/** Node mailer libs */
import * as nodemailer from 'nodemailer';
const smtpTransport = require('nodemailer-smtp-transport');

class EmailService {
	public sendEmail(apiVersion: any, req: any, res: any, next: any) {
		// if (!isAuthorized(req)) {
		// return res.status(403).send('You are not authorized!');
		// }

		try {
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
			);

			const mailOptions = {
				from: 'example@gmail.com',
				to: req.body.email,
				subject: req.body.subject,
				html: req.body.content,
			};

			transport.sendMail(mailOptions, (error, info) => {
				if (error) {
					res.json({ code: 'error', msg: error });
				} else {
					res.json({ code: 'success', msg: 'Message sent, thank you!' });
				}
			});
		} catch (e) {
			res.status(500).send('Internal Server Error');
		}
	}
}

export default new EmailService().sendEmail;
