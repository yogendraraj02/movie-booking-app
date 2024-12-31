
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import bookingService from '../services/bookingService';
import AppError from '../utils/AppError';
import authService from '../services/authService';
// import { SessionRequest } from '../middlewares/sessionMiddleware';
import { redisClient } from '../db/redis';
import bookingservice from '../services/bookingService';
// import { authenticateUser } from '../services/authService';


export const checkSeatAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { showId } = req.params;
    const availableSeats = await bookingService.checkSeatAvailability(
      parseInt(showId, 10)
    );
    res.json({ availableSeats });
  } catch (error) {
    next(error);
  }
};

  export const lockSeats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { showId, seatIds } = req.body;
      const sessionId = req.session.id;

      const locks = await bookingService.lockSeats(showId, seatIds,sessionId as string);

      // await new Promise<void>((resolve) => {
      //   typedReq.session.save(() => resolve());
      // });

      res.json({ message: 'Seats locked successfully', locks });
    } catch (error) {
      console.log(`e`,error);
      
      next(error);
    }
  };


export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {  showId, totalAmount } = req.body; // seat is already locked so we will not take this again..
  try {
    // Get the session ID from the request object
    // If the user is not logged in, ask them to log in
    if (!req.session.user) {
      // return res.redirect('/auth/login'); // Redirect to the login page
      return res.status(400).json({success : false, message : "Login required!"});
    }
    console.log(`req.session.user`,req.session.user);
    
    const typedReq = req ;
    // const guestToken = req.cookies.guestToken; // Get from cookie, not session
    // console.log(`cookie guestToken and other`,guestToken, req.session.guestToken);
    // console.log(`req.session.userId .lockedSeats`,req.session.userId, req.session.lockedSeats);
    
    // console.log(`session`,req.session.id,req.session,req.session.bookingData);
    
    const userId = Number(req.session.user.id); // Get the user ID

    const lockedSeatsIds = await bookingservice.getLockedSeatsBySession(req.sessionID);
    console.log(`locked seats found`,lockedSeatsIds);

    if (!userId || !lockedSeatsIds || !lockedSeatsIds.length) {
        return res.status(400).json({ error: 'Invalid session or no locked seats' });
    }

   
     const sessionId = req.cookies.sessionId || req.sessionID;
    const booking = await bookingService.createBooking(
      userId,
      showId,
      lockedSeatsIds,
      totalAmount,
      sessionId
    );
   
    res.status(201).json({ booking });
  } catch (error : any) {
    console.log(`err`,error);
    
    next(new AppError(400, error.message));
  }
};


//Login Before Confirm Booking
