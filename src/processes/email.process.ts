import { Job } from 'bull';
import nodemailer from 'nodemailer';

const emailProcess = async (job: Job) => {
  console.log('Processing email job', job.data);

  // let testAccount = await nodemailer.createTestAccount();
    // console.log(`testAccount`,testAccount);
    
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
     user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const { from, to, subject, text } = job.data;

  let info = await transporter.sendMail({
    from : {
      name : `MovieBookingApp`,
      address : from
    },
    to,
    subject,
    text,
    html: `<b>${text}</b>`
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return nodemailer.getTestMessageUrl(info);
}

export default emailProcess;