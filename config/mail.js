const nodemailer = require('nodemailer');

const tran = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
    };
    try {
        await tran.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Error sending mail", err);
    }
};

module.exports = sendEmail;
