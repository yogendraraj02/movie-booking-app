// src/types/express-session.d.ts
import { SessionData } from 'express-session';

import 'express-session';

// Session type definition
declare module 'express-session' {
    interface SessionData {
      // guestId?: string;
      user : {
        id : number,
        name : string,
        email : string,
      } , // userInfo
      token : string // auth token
      
      lockedSeats?: number[];
      bookingData?: {
        movieId: string;
        showtime: string;
        seats: string[];
        timestamp: number;
      };



    }
}