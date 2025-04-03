import nodemailer from "nodemailer";
import { logger } from "./logger.js";

export const sendVerificationCode = async (email, verificationCode) => {
	try {
		// Create a transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
			auth: {
				user: process.env.SMTP_USER, // generated ethereal user
				pass: process.env.SMTP_PASS, // generated ethereal password
			},
		});

		// Send mail with defined transport object
		let info = await transporter.sendMail({
			from: `"Rifolks-Drifts" <${process.env.SMTP_USER}>`, // sender address
			to: email, // list of receivers
			subject: "Verification Code", // Subject line
			text: `Your verification code is: ${verificationCode}`, // plain text body
			html: `<b>Your verification code is: ${verificationCode}</b>`, // html body
		});

		logger.info("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		logger.error("Error sending email:", error);
	}
};