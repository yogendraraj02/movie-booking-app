import { PrismaClient } from "@prisma/client";
// interface CreateMovieDto {
//     title: string;
//     description: string;
//     duration: number;
//     language: string;
//     genres: number[]; // IDs of the associated genres
//     // other movie properties
//     releaseDate : string,
//   }
  interface CreateMovieDto {
    title: string;
    description: string;
    duration: number;
    language: string;
    releaseDate: Date;
    genres: number[]; // IDs of the associated genres
    endDate?: Date;
    posterUrl?: string;
  }
 class MovieService {
  private prisma = new PrismaClient();

  async createMovie(data: CreateMovieDto) {
    const { genres, ...movieData } = data;

    return this.prisma.$transaction(async (tx) => {
      // Create movie
      const movie = await tx.movie.create({
        data: movieData,
      });

      // Connect genres
      if (genres && genres.length > 0) {
        await tx.movieGenre.createMany({
          data: genres.map((genreId) => ({
            movieId: movie.id,
            genreId,
          })),
        });
      }

      // Fetch the created movie with its associated genres
      return tx.movie.findUnique({
        where: { id: movie.id },
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      });
    });
  };

  }

  const movieObject = new MovieService();
export default movieObject;
