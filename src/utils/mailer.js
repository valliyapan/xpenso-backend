import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendMail(toMail, subject, htmlData) {
    return new Promise((res, rej) => {
        const mailOptions = {
            from: `"Xpenso" <${process.env.EMAIL_USER}>`,
            to: toMail,
            subject,
            html: htmlData,
        };

        transporter
        .sendMail(mailOptions)
        .then((value) => {
            console.log('Send mail callback response:', value);
            if (value.rejected.length > 0) {
                console.error('Email delivery rejected for:', toMail);
                rej(false);
            }
            res(true);
        })
        .catch((err) => {
            rej(err);
        });
    });
};
