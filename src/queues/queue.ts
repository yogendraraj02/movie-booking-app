// queue.js

import Bull from "bull";


const emailQueue = new Bull('emailQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  limiter: {
    groupKey: 'type', // Limit jobs by type (email, sms, etc.)
    max: 1000,         // Maximum jobs to process per minute
    duration: 60000,   // Time window in ms
  },
});

export default emailQueue;
