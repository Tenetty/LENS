const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "girishdhanawade12@gmail.com",
        pass: process.env.EMAIL_PASS || "rtqqugjhuleexpxb",
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    let info = await transporter.sendMail({
      from: `"LENS Tourism Portal" <${process.env.EMAIL_USER || "girishdhanawade12@gmail.com"}>`,
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
