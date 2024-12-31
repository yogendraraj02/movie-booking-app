It seems like your job queue is not adding jobs as expected, and when you run the Redis command `LRANGE bull:email:wait 0 -1`, it shows that the `bull:email:wait` list is empty. This suggests that jobs are not being added to the queue or are not being processed.

Let's walk through a few troubleshooting steps to diagnose and resolve the issue:

### 1. **Check Redis Connection**:
Ensure that your Redis server is running and accessible. You should see a message like `redis connected!` in your console if the connection is working correctly.

You can test Redis by running the following command in your terminal (assuming Redis is running locally):
```bash
redis-cli ping
```
If it responds with `PONG`, then your Redis server is up and running.

### 2. **Ensure Jobs Are Being Added to the Queue**:
You mentioned the queue is empty. Let’s verify that jobs are indeed being added. Double-check your `sendNewEmail` function to ensure that jobs are being enqueued.

For example, add some logging inside the `sendNewEmail` function to see if it's being triggered and that a job is actually being added to the queue.

#### Check `emailQueue.add` in `sendNewEmail`:
```typescript
const sendNewEmail = async (email: { from: string; to: string; subject: string; text: string }) => {
  try {
    // Log the email data to ensure it's being passed correctly
    console.log('Adding email job to the queue:', email);
    
    // Add job to the queue
    await emailQueue.add({ ...email }, { attempts: 3 });

    console.log('Job added to queue');
  } catch (error) {
    console.error('Error adding job to queue:', error);
  }
};
```

This will log the email data and confirm whether the job is being added to the queue. If this logs correctly and you still don't see the job in Redis, there could be an issue with the Redis client or Bull configuration.

### 3. **Check Bull Queue Configuration**:
Ensure that you're correctly configuring the Bull queue. For example, check if you’re passing the correct Redis client or Redis connection settings in the `Bull` initialization.

If you're using a shared Redis client across sessions and Bull, ensure you're properly passing the Redis client to Bull's configuration.

```typescript
// Shared Redis client for both session and Bull
import { createClient } from 'redis';
import Bull from 'bull';

const redisClient = createClient({ host: '127.0.0.1', port: 6379 });

// Email queue setup using shared redis client
const emailQueue = new Bull('email', {
  redis: {
    client: redisClient, // Use the same client as the session store
  },
});
```

Alternatively, if you're using separate clients for session storage and Bull, you can define two different Redis clients.

### 4. **Verify Queue Processor is Set Up**:
Double-check if you've registered the processor for the queue. If the processor isn’t set up or there’s an issue in the processing function, jobs might be added but never processed.

#### Example Processor:
Ensure that your `emailProcess` function is correctly implemented. For example:

```typescript
import { Job } from 'bull';

// Registering a job processor
emailQueue.process(async (job: Job) => {
  const { from, to, subject, text } = job.data;

  try {
    // Log job data to ensure it's being processed
    console.log(`Processing job for email from ${from} to ${to}`);
    
    // Simulate sending an email (replace with actual email sending logic)
    // e.g., nodemailer.sendMail(...) 
    // For now, we're just logging the data
    console.log(`Subject: ${subject}, Text: ${text}`);
    
    // Simulate a successful job completion
    return Promise.resolve();
  } catch (error) {
    console.error('Error processing job:', error);
    throw error; // This will ensure the job gets retried if needed
  }
});
```

This function should be imported and executed when the application starts. Make sure this code is running and that the `process` method is registered correctly.

### 5. **Check Queue Events**:
Bull emits various events that can help you troubleshoot, such as `waiting`, `completed`, `failed`, etc. Use them to log queue status and see what's going on behind the scenes.

For example, add the following event listeners to see if the jobs are being processed and completed:

```typescript
emailQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed`);
});

emailQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed successfully with result: ${result}`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});
```

### 6. **Manually Add Jobs via Redis CLI**:
You can manually add a job to the queue using Redis CLI to verify that it’s being added correctly to the `bull:email:wait` list.

```bash
127.0.0.1:6379> LPUSH bull:email:wait '{"data":{"from":"sender@example.com","to":"recipient@example.com","subject":"Test Email","text":"This is a test email."}}'
```

This command pushes a job into the `bull:email:wait` list. After running this, check again with the `LRANGE` command:

```bash
127.0.0.1:6379> LRANGE bull:email:wait 0 -1
```

If this job appears, it confirms that Bull is correctly adding jobs to the queue, and the issue might be with your job-enqueuing logic or timing.

### 7. **Check for Job Scheduling Issues**:
If jobs are still not being added or processed, ensure that there is no issue with your app's timing or logic that might delay or skip job scheduling. You can also verify if you're accidentally adding jobs conditionally or if the job addition is being skipped due to an error or unmet condition.

### Conclusion:
To summarize:
1. **Log everything**: Add logs inside `sendNewEmail` and the job processor to verify the flow of the program.
2. **Redis connection**: Ensure Redis is accessible and not experiencing issues.
3. **Verify Bull configuration**: Make sure Bull is properly configured with the correct Redis client.
4. **Check events**: Use Bull’s event system to check for job status.
5. **Manually test**: Use Redis CLI to manually add a job and check if it's processed.

Once you confirm the basic flow works (i.e., jobs are added and processed), you can fine-tune and add error handling, retries, and other features.