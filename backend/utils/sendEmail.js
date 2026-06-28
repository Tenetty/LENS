const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ppatil2343ab@gmail.com",
        pass: "rlnogycqaqnywbbi",
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    let info = await transporter.sendMail({
      from: '"LENS Tourism Portal" <ppatil2343ab@gmail.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
