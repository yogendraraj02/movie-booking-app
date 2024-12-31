// src/services/bookingService.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

const LOCKTIME_MINUTES = 15 ;
class BookingService {
  private prisma = new PrismaClient();

   async checkSeatAvailability (showId: number){
    const currentTime = new Date();
    
    // First get all seats that are not booked for this show
    const availableSeats = await prisma.seat.findMany({
      where: {
        // No existing bookings for this show
        bookings: { none: { show: { id: showId } } },
      },
      include: {
        category: true
      }
    });
  
    // Then get all active locks for this show
    const activeLocks = await prisma.seatLock.findMany({
      where: {
        showId,
        lockExpiresAt: { gt: currentTime }
      }
    });
  
    // Filter out locked seats
    const lockedSeatIds = new Set(activeLocks.map(lock => lock.seatId));
    const trulyAvailableSeats = availableSeats.filter(seat => !lockedSeatIds.has(seat.id));
  
    return trulyAvailableSeats;
  };
  // Lock seats
  async lockSeats(
    showId: number, 
    seatIds: number[], 
    sessionId: string
  ) {
    const currentTime = new Date();
    
    return await prisma.$transaction(async (tx) => {
      // Check if seats are already booked
      const bookedSeats = await tx.seat.findMany({
        where: {
          id: { in: seatIds },
          bookings: { 
            some: { 
              show: { id: showId }
            } 
          }
        }
      });
  
      if (bookedSeats.length > 0) {
        throw new AppError(400, 'Some seats are already booked');
      }
  
      // Check for existing active locks
      const existingLocks = await tx.seatLock.findMany({
        where: {
          showId,
          seatId: { in: seatIds },
          lockExpiresAt: { gt: currentTime }
        }
      });
  
      if (existingLocks.length > 0) {
        throw new AppError(400, 'Some seats are already locked');
      }
  
      // Create new locks
      return await tx.seatLock.createMany({
        data: seatIds.map((seatId) => ({
          showId,
          seatId,
          lockExpiresAt: new Date(Date.now() + LOCKTIME_MINUTES * 60 * 1000), // 15 minutes
          sessionId,
        }))
      });
    });
  };

  async createBooking (
    userId: number,
    showId: number,
    seatIds: number[],
    totalAmount: number,
    sessionId: string
  ) {
    const currentTime = new Date();
    console.log(`userId,showId,seatIds`,userId,showId,seatIds);
    
    return await prisma.$transaction(async (tx) => {
      // Step 1: Check for valid locks
      const existingLocks = await tx.seatLock.findMany({
        where: {
          showId,
          // seatId: { in: seatIds },
          lockExpiresAt: { gt: currentTime }
        }
      });
      
      console.log(`exisitingLocks`,existingLocks );
      
      if (existingLocks.length !== seatIds.length) {
        throw new AppError(400, 'Some seats are not locked or locks have expired');
      }
  
      // Step 2: Create the booking
      const booking = await tx.booking.create({
        data: {
          userId,
          showId,
          totalAmount,
          status: 'PENDING',
          seats: {
            connect: seatIds.map((seatId) => ({ id: seatId }))
          }
        },
        include: {
          seats: true,
          show: {
            include : {
              movie : true,
              screen : true,
            }
          }
        }
      });
  
      // Step 3: Remove the locks
      await tx.seatLock.deleteMany({
        where: {
          showId,
          seatId: { in: seatIds },
          // sessionId
        }
      });
  
      return booking;
    });
  };

  async getLockedSeatsBySession(sessionId : string) {
    const currentTime = new Date();
    
      // Check for existing active locks
      const existingLocks = await prisma.seatLock.findMany({
        where: {
          sessionId,
          lockExpiresAt: { gt: currentTime }
        }
      });
      const onlySeatIds = existingLocks.map(entry => entry.id);
      return onlySeatIds;
  };


  async transferBookingSession (oldSessionId: string, newSessionId: string, userId: number){
    return await prisma.$transaction(async (tx) => {
      // Find existing seat locks with the old session ID
      const seatLocks = await tx.seatLock.findMany({
        where: {
          sessionId: oldSessionId,
          lockExpiresAt: { gt: new Date() } // Only active locks
        }
      });
      console.log(`seat locks found`,seatLocks);
      
      if (seatLocks.length === 0) {
        return null; // No locks to transfer
      }
  
      // Update the seat locks with the new session ID and user ID
      await tx.seatLock.updateMany({
        where: {
          sessionId: oldSessionId,
          lockExpiresAt: { gt: new Date() }
        },
        data: {
          sessionId: newSessionId,
        }
      });
  
      // Return the updated seat IDs
      return seatLocks.map((lock) => lock.seatId);
    });
  };
  
}







// Create booking








const bookingservice = new BookingService();
export default bookingservice;