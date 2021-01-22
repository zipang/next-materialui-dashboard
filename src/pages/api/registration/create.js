import { getProperty } from "@lib/utils/NestedObjects";
import nodemailer from "nodemailer";

export default async (req, res) => {
	const { name, email, text } = req.body;

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD
		}
	});

	const message = {
		from: `${process.env.EMAIL}`,
		to: getProperty(data, "representant.email"),
		subject: `Création d'un nouvel Organisme`,
		text: `
    ${name} wrote:
    ${text}
    `
	};

	await transporter.sendMail(message);

	res.send("success");
};
