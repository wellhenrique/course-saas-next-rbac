import { z } from 'zod'
import { hash } from 'bcryptjs'
import { type FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Create a new user',
        description: 'Create a new user',
        tags: ['Account'],
        body: z.object({
          name: z.string().min(2),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('user with same e-mail already exists.')
      }

      const [, domain] = email.split('@')

      const autoJoinOrganization = await prisma.organization.findFirst({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })

      const hashedPassword = await hash(password, 6)

      const memberOn = autoJoinOrganization
        ? {
            create: { organizationId: autoJoinOrganization.id },
          }
        : undefined

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          member_on: memberOn,
        },
      })

      return reply.status(201).send()
    },
  )
}
