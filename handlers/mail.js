const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

// setup to work with Mailtrap.io
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.send = async (options) => {
  const mailOptions = {
    from: 'Yoichi Nagano <ymnagano@protonmail.com',
    to: options.user.email,
    subject: options.subject, 
    html: 'This will be filled in later',
    text: 'This will also be filled in later'
  };
  const sendMail = promisify(transport.sendMail, transport);  
  return sendMail(mailOptions);
}

// transport.sendMail({
//   from: 'Yoichi Nagano <ymnagano@protonmail.com>',
//   to: 'danielle.keita.taguchi@gmail.com',
//   subject: 'Just trying things out!',
//   html: 'Hey I <strong>love</strong> you',
//   text: 'hey I **love** you'
// });