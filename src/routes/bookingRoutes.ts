import { Router } from 'express';
import { checkSeatAvailability, lockSeats, createBooking } from '../controllers/bookingController';
const router = Router();


router.get('/availability/:showId', checkSeatAvailability);
router.post('/lock' ,lockSeats);
router.post('/create', createBooking as any);

export default router;