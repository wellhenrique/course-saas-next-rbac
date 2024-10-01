import { z } from 'zod'
import { Role } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get all user pending invites',
          description: 'Get all user pending invites',
          security: [{ BearerAuth: [] }],
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.string().uuid(),
                  email: z.string().email(),
                  role: z.nativeEnum(Role),
                  author: z
                    .object({
                      id: z.string().uuid(),
                      name: z.string().nullable(),
                    })
                    .nullable(),
                  organization: z
                    .object({
                      name: z.string(),
                    })
                    .nullable(),
                  createdAt: z.date(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const sub = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: sub,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found or not exists.')
        }

        const invites = await prisma.invite.findMany({
          select: {
            id: true,
            email: true,
            role: true,

            author: {
              select: {
                id: true,
                name: true,
              },
            },

            organization: {
              select: {
                name: true,
              },
            },

            createdAt: true,
          },
          where: {
            email: user.email,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return { invites }
      },
    )
}
