
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
class UserService{
  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.user.create({
      data
    });
  };
  
  async getUserWithBookings(userId: number) {
    // console.log(`get user`);
    
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: true
      }
    });
  };

  
}

const userService = new UserService();
export default userService;