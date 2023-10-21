const nodemailer = require('nodemailer');

const sendEmail = async (option) =>{

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "170b1011da00f0",
          pass: "134a089181c37c"
        }
      });

      const mailOption = {
        from: "info@dehghanifard.ir",
        to: option.to, 
        subject: option.subject, 
        text: option.text,
      };

      await transport.sendMail(mailOption)
}

module.exports = sendEmail;