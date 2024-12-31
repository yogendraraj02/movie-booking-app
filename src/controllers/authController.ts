
import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";
import authService from '../services/authService';
import {generateToken, authenticate,authorize} from "../middlewares/auth"
import userService from '../services/userService';

const saltRounds = 10;

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await authService.createUser(name, email, hashedPassword);

    // Generate a JWT token
     // Generate a JWT token
     const token = generateToken(user);
     req.session.user = user; // save user info in session
     req.session.token = token; // save token for future user (not as of now)
     res.json({
       success : true,
       message: 'Login successful',
       user: {
         id: user.id,
         email: user.email
       }
     });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Authenticate the user
    const user = await authService.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user);
    req.session.user = user; // save user info in session
    req.session.token = token; // save token for future user (not as of now)
    res.json({
      success : true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      }
    });


  } catch (error) {
    console.log(`e:`,error);
    
    next(error);
  }
};


export const logout = async (req : Request, res : Response, next : NextFunction) => {
  try{

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }

        // Clear the session cookie
        res.clearCookie('sessionId');

        return res.status(200).json({ message: 'Logged out successfully' });
    });


  } catch(e){
    next(e);
  }
}


export async function editUserProfile(req:Request, res : Response, next : NextFunction){
  try{
    const userId = req.session.user?.id as number;
    const {name, password} = req.body;
    // const user = await
   let user = await authService.authenticateUserById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await authService.editUserProfile(userId,name,password);
    user = await authService.authenticateUserById(userId);
    res.json(user);
  } catch(e){

  }
}