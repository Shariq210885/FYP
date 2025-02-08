const nodemailer = require("nodemailer");

const sendEmail = async (emailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465, // Use 465 for secure connections
    secure: true,
    auth: {
      user: `${process.env.SENDER_EMAIL}`,
      pass: `${process.env.MAIL_PASS}`,
    },
  });

  const mailOptions = {
    from: `${process.env.SENDER_EMAIL}`,
    to: `${emailOptions.email}`,
    subject: `${emailOptions.subject}`,
    text: `${emailOptions.text}`,
    html: `${emailOptions.html}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

module.exports = sendEmail;