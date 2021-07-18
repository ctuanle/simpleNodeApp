import nodemailer from "nodemailer";
require("dotenv").config();

export const sendmail = (message: nodemailer.SendMailOptions, callback: Function) => {
    const transporter = nodemailer.createTransport({
        host: process.env.ETHEREAL_HOST,
        port: Number(process.env.ETHEREAL_PORT),
        auth: {
            user: process.env.ETHEREAL_USER,
            pass: process.env.ETHEREAL_PASS,
        },
    });

    transporter.sendMail(message, (err, info) => {
        if (err) callback(err);
        callback(null, info);
    });
};
