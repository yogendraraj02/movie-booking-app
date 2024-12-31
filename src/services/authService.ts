// src/services/authService.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import AppError from '../utils/AppError';
const prisma = new PrismaClient();


class AuthService {
    private prisma = new PrismaClient();
  
    async authenticateUser (email : string, password : string) {
        try {
            const user = await prisma.user.findUnique({where : {email}});
            
            // we do not need to hash our plain text password
            // before we pass it to bcrypt.compare
            // bcrypt.compare will always return resolved Promise with a boolean value
            // indicating whether the password hashes match
            const match = await bcrypt.compare(password, user?.password as string);
            
            if (match) {
                return user;
            } else {

                return Promise.reject('wrong username or password');
            }
        } catch(err) {
            return Promise.reject('user not found');
        }
    }
    async authenticateUserById (id : number) {
        try {
            const user = await prisma.user.findUnique({where : {id}});
          
            if (user) {
                return user;
            } else {

                return Promise.reject('wrong user id');
            }
        } catch(err) {
            return Promise.reject('user not found');
        }
    }

    async createUser(name : string, email : string, password : string){
        try{
             // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({data : {name, email,password : hashedPassword}});
            return newUser;
        } catch(e){
            console.log(`e`,e);
            
            throw new Error("Something went wrong");
        }
    }

    // Method to edit an existing user's profile
    async editUserProfile(userId: number, name?: string, password?: string) {
        try {
        const updatedData: any = {};

        if (name) updatedData.name = name;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        // Update user profile in the database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedData,
        });

        return updatedUser;
        } catch (e) {
        console.error("Error editing user profile:", e);
        throw new Error("Something went wrong while editing the user profile");
        }
    }
}
  
  
const authService = new AuthService();
export default authService;



