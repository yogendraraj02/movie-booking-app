import { PrismaClient } from "@prisma/client";

class GenreService {
    private prisma = new PrismaClient();
  
    async createGenre(name: string) {
      // Check if the genre already exists to avoid duplication
      const existingGenre = await this.prisma.genre.findUnique({
        where: { name },
      });
  
      if (existingGenre) {
        return existingGenre; // Return existing genre if found
      }
  
      // Create a new genre if not found
      return this.prisma.genre.create({
        data: { name },
      });
    }
  }
  
  
  const genreService = new GenreService();
export default genreService;