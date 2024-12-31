
import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';



export async function getUserWithBookings(req: Request, res: Response, next: NextFunction) {
  try {
    // const userId = parseInt(req.params.id);
    const userId = Number(req.session.user?.id);
    const user = await userService.getUserWithBookings(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
}
