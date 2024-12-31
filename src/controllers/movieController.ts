
import { Request, Response, NextFunction } from 'express';
import  movieService from '../services/movieService';

export async function createMovie(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await movieService.createMovie(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

// export async function getUserWithBookings(req: Request, res: Response, next: NextFunction) {
//   try {
//     const userId = parseInt(req.params.id);
//     const user = await movieService.(userId);
    
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
    
//     res.json(user);
//   } catch (error) {
//     next(error);
//   }
// }