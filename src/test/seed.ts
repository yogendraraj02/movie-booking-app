
// npx ts-node src/test/insertRecord.ts

import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  // Clear existing data
  await prisma.booking.deleteMany()
  await prisma.seatLock.deleteMany()
  await prisma.show.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.seatCategory.deleteMany()
  await prisma.screen.deleteMany()
  await prisma.theatreAmenity.deleteMany()
  await prisma.amenity.deleteMany()
  await prisma.theatre.deleteMany()
  await prisma.city.deleteMany()
  await prisma.movieGenre.deleteMany()
  await prisma.genre.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.user.deleteMany()

  // Seed Cities
  const cities = await Promise.all([
    prisma.city.create({ data: { name: 'Mumbai', state: 'Maharashtra' } }),
    prisma.city.create({ data: { name: 'Delhi', state: 'Delhi' } }),
    prisma.city.create({ data: { name: 'Bangalore', state: 'Karnataka' } }),
  ])

  // Seed Amenities
  const amenities = await Promise.all([
    prisma.amenity.create({ data: { name: 'Parking' } }),
    prisma.amenity.create({ data: { name: 'Food Court' } }),
    prisma.amenity.create({ data: { name: 'AC' } }),
  ])

  // Seed Theatres
  const theatres = await Promise.all(
    cities.map(city => 
      prisma.theatre.create({
        data: {
          name: faker.company.name() + ' Cinemas',
          address: faker.location.streetAddress(),
          cityId: city.id,
          amenities: {
            create: amenities.slice(0, 2).map(amenity => ({
              amenityId: amenity.id
            }))
          }
        }
      })
    )
  )

  // Seed Screens
  const screens = await Promise.all(
    theatres.flatMap(theatre => 
      ['AUDI 1', 'AUDI 2', 'AUDI 3'].map(name => 
        prisma.screen.create({
          data: {
            name,
            theatreId: theatre.id,
            capacity: faker.number.int({ min: 100, max: 300 }),
            screenType: faker.helpers.arrayElement(['STANDARD', 'IMAX', '4DX'])
          }
        })
      )
    )
  )

  // Seed Seat Categories
  const seatCategories = await Promise.all(
    screens.map(screen => 
      prisma.seatCategory.create({
        data: {
          name: faker.helpers.arrayElement(['SILVER', 'GOLD', 'PLATINUM']),
          screenId: screen.id,
          basePrice: faker.commerce.price({ min: 100, max: 500 })
        }
      })
    )
  )

  // Seed Seats
  const seats = await Promise.all(
    seatCategories.flatMap(category => {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      return rows.flatMap(row => 
        Array.from({ length: 10 }, (_, i) => 
          prisma.seat.create({
            data: {
              seatNumber: `${row}${i + 1}`,
              row,
              categoryId: category.id
            }
          })
        )
      )
    })
  )

  // Seed Genres
  const genres = await Promise.all([
    'Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi'
  ].map(name => 
    prisma.genre.create({ data: { name } })
  ))

  // Seed Movies
  const movies = await Promise.all(
    Array.from({ length: 10 }, () => {
      const releaseDate = faker.date.recent({ days: 30 })
      return prisma.movie.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          duration: faker.number.int({ min: 90, max: 180 }),
          language: faker.helpers.arrayElement(['Hindi', 'English', 'Tamil', 'Telugu']),
          rating: faker.number.float({ min: 1, max: 5 }),
          releaseDate,
          endDate: new Date(releaseDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days after release
          posterUrl: faker.image.urlLoremFlickr({ category: 'movie' }),
          genres: {
            create: faker.helpers.arrayElements(genres, { min: 1, max: 3 })
              .map(genre => ({ genreId: genre.id }))
          }
        }
      })
    })
  )

  // Seed Shows
  const shows = await Promise.all(
    movies.flatMap(movie => 
      screens.map(screen => {
        const startTime = faker.date.soon()
        return prisma.show.create({
          data: {
            movieId: movie.id,
            screenId: screen.id,
            startTime,
            endTime: new Date(startTime.getTime() + movie.duration * 60 * 1000)
          }
        })
      })
    )
  )

  // Seed Users
  const users = await Promise.all(
    Array.from({ length: 20 }, () => 
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          role: faker.helpers.arrayElement(['CUSTOMER', 'CUSTOMER', 'CUSTOMER', 'ADMIN'])
        }
      })
    )
  )

  console.log('Database seeded successfully!')
}

seedDatabase()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })