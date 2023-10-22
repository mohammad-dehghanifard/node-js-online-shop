const nodemailer = require('nodemailer');

const sendEmail = async (option) =>{

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "170b1011da00f0",
      pass: "********c37c"
    }
  });

      const mailOption = {
        from: "myppvmohammad@gmail.com",
        to: option.to, 
        subject: option.subject, 
        text: option.text,
      };

      await transport.sendMail(mailOption)
}

module.exports = sendEmail;