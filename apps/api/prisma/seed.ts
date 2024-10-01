import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.invite.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.project.deleteMany()
  await prisma.token.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await hash('123456', 1)

  const [user, anotherUserOne, anotherUserTwo] =
    await prisma.user.createManyAndReturn({
      data: [
        {
          name: 'John Doe',
          email: 'john@acme.com',
          passwordHash: hashedPassword,
          avatarUrl: faker.image.avatar(),
        },
        {
          name: 'Jane Doe',
          email: 'jane@acme.com',
          passwordHash: hashedPassword,
          avatarUrl: faker.image.avatar(),
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          passwordHash: hashedPassword,
          avatarUrl: faker.image.avatar(),
        },
      ],
    })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUserOne.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUserTwo.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUserOne.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUserTwo.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'BILLING',
            },
            {
              userId: anotherUserOne.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUserTwo.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
})
