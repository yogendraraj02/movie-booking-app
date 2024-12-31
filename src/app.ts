
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import movieRoutes from './routes/movieRoutes';

import bookingRoutes from './routes/bookingRoutes';
import authRoutes from './routes/authRoutes';
import errorHandler from './middlewares/errorHandler';

import cookieParser from 'cookie-parser';

import session from "express-session"
import RedisStore from 'connect-redis';
import {  redisClientForSessions } from './db/redis';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import swaggerSpec from './swagger';
import { checkLogin } from './middlewares/auth';
import nodemailer from "nodemailer";
import { sendNewEmail } from './queues/email.queue';
import Bull from 'bull';
import emailProcess from './processes/email.process';
const app  = express();

const corsOptions = {
  origin: '*', // Replace with your client URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Important for cookies
};


app.use(cors(corsOptions)); // Enable CORS for all routes

app.use(express.json());
app.use(cookieParser());


const redisStore = new RedisStore({
  client: redisClientForSessions,
  prefix: 'movieappSessions:', // Prefix for session keys
  ttl: 30 * 60, // 30 minutes in seconds
});


// Session middleware configuration
app.use(session({
  store: redisStore,
  secret: 'mysecretkey',
  name: 'sessionId',
  resave: false,
  saveUninitialized: true, // Important: Set to true for guest sessions
  cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));


redisClientForSessions.on("connect", () => {
  console.log(`Redis connected for session store!`);
});

// emailQueue.process(emailProcess).then(res => {
//   console.log(`emailQueue process`);
  
// })

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// app.get('/', function (req, res) {
//   // create new session object.
//   console.log(`eq.sessionID`,req.sessionID);
  
//   if (req.session.user?.id) {
//       // user is already logged in
//       res.redirect('/chat');
//   } else {
//       // no session found, go to login page
//       res.redirect("/login");
//   }
// });
// app.get('/viewsCount',(req,res,next) => {
//   if(req.session.count){
//     req.session.count += 1;
//   } else {
//     req.session.count = 1;
//   }
//   return res.send(`View counts of this page ${req.session.count}`);
// })




// Routes
app.use('/api/users',checkLogin as any, userRoutes);
app.use('/api/movies',movieRoutes)

app.use('/api/bookings', bookingRoutes);

app.use('/api/auth', authRoutes);

// app.post("/send-email", async (req, res) => {
//   const { from, to, subject, text } = req.body;

//   // Use a test account as this is a tutorial
//   const testAccount = await nodemailer.createTestAccount();
//   console.log(`testAcc`,testAccount);
  
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
    
//     port: 587,
//     secure: false,
//     auth: {
//       // user: "nicklaus.durgan@ethereal.email",//testAccount.user,
//       // pass:  "Q2NKBGJevPshmWbWkp",//testAccount.pass
//       "user": "cisbackend@gmail.com",
//       "pass": "hkhg cjkv kdla fvpd"
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   console.log("Sending mail to %s", to);

//   let info = await transporter.sendMail({
//     from : "cisbackend@gmail.com",
//     to,
//     subject,
//     text,
//     html: `<strong>${text}</strong>`,
//   });

//   console.log("Message sent: %s", info.messageId);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

//   res.json({
//     message: "Email Sent",
//   });
// });
app.post("/send-email-revised", async (req, res) => {
  const { from, to, subject, text } = req.body;

  await sendNewEmail({ from, to, subject, text });

  console.log("Added to queue");

  res.json({
    message: "Email Sent",
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;