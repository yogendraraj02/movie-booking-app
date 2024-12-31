// // src/seed.ts
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // Add Cities
//   const city1 = await prisma.city.create({ data: { name: 'Ujjain', state: 'M.P' } });
//   const city2 = await prisma.city.create({ data: { name: 'Indore', state: 'M.P' } });

//   // Add Theatres
//   const theatre1 = await prisma.theatre.create({ data: { name: 'PVR Cinemas', address: 'Cosmos Mall', cityId: city1.id } });
//   const theatre2 = await prisma.theatre.create({ data: { name: 'Inox', address: 'C21 Vijay Nagar', cityId: city2.id } });

//   // Add Screens and Seats
//   const screen1 = await prisma.screen.create({
//     data: { name: 'Audi 1', theatreId: theatre1.id, capacity: 100, screenType: 'STANDARD' }
//   });
//   const screen2 = await prisma.screen.create({
//     data: { name: 'Box Office 1', theatreId: theatre2.id, capacity: 80, screenType: 'IMAX' }
//   });

//   // Add Seat Categories
//   const category1 = await prisma.seatCategory.create({ data: { name: 'SILVER', screenId: screen1.id, basePrice: 150.00 } });
//   const category2 = await prisma.seatCategory.create({ data: { name: 'GOLD', screenId: screen2.id, basePrice: 280.00 } });

//   // Add Seats
//   await prisma.seat.createMany({
//     data: [
//       { seatNumber: 'A1', row: 'A', categoryId: category1.id },
//       { seatNumber: 'A2', row: 'A', categoryId: category1.id },
//       { seatNumber: 'B1', row: 'B', categoryId: category2.id },
//       { seatNumber: 'B2', row: 'B', categoryId: category2.id },
//     ]
//   });

//   // Add Movies
//   const movie1 = await prisma.movie.create({
//     data: { title: 'Bhool Bhulaiya', description: 'Description 1', duration: 120, language: 'Hindi', rating: 4.5, releaseDate: new Date('2024-11-01') }
//   });
//   const movie2 = await prisma.movie.create({
//     data: { title: 'Movie 2', description: 'Description 2', duration: 150, language: 'Hindi', rating: 4.0, releaseDate: new Date('2024-11-02') }
//   });

//   // Add Shows
//   const show1 = await prisma.show.create({
//     data: { movieId: movie1.id, screenId: screen1.id, startTime: new Date('2024-11-07T10:00:00Z'), endTime: new Date('2024-11-07T12:00:00Z') }
//   });
//   const show2 = await prisma.show.create({
//     data: { movieId: movie2.id, screenId: screen2.id, startTime: new Date('2024-11-07T14:00:00Z'), endTime: new Date('2024-11-07T16:30:00Z') }
//   });

//   console.log('Seeding completed');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
