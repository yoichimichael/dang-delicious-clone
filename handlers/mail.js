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

// not needed anywhere outside of this file, so no exports.generateHTML
const generateHTML = (filename, options = {}) => {
  // __dirname refers to current directory
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html);

  return inlined;
}

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: 'Yoichi Nagano <ymnagano@protonmail.com',
    to: options.user.email,
    subject: options.subject, 
    html,
    text
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