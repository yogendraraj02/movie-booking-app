import Bull from "bull";
import emailProcess from '../processes/email.process';
import  emailQueue from  "./queue"
// const emailQueue = new Bull('email', {
//   redis: '127.0.0.1:6379'
// });
// const emailQueue = new Bull('emailQueue', {
//     redis: '127.0.0.1:6379'
//   });
  
emailQueue.process(emailProcess);
emailQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});


const sendNewEmail = async (email: {
  from: string;
  to: string;
  subject: string;
  text: string;
}) => {
  emailQueue.add({ ...email }, {
    attempts: 3
  });
};

export {
  sendNewEmail
};