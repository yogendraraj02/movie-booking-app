
import IORedis from 'ioredis';


export const redisClientForSessions = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
// export const redisClientForBull = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

// app.use(
//     session({
//         store: new RedisStore({ client: redisClient }),
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             secure: false,
//             httpOnly: true,
//             maxAge: 1000 * 60 * 60 * 3,
//         },
//     })
// )