import { z } from 'zod'
import { Role } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get organizations where user is a member',
          security: [{ BearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: z.nativeEnum(Role),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const sub = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId: sub,
              },
            },
          },
          where: {
            members: {
              some: {
                userId: sub,
              },
            },
          },
        })

        const organizationsWithUserRole = organizations.map(
          ({ members, ...organization }) => {
            const role = members[0].role

            return {
              ...organization,
              role,
            }
          },
        )
        return {
          organizations: organizationsWithUserRole,
        }
      },
    )
}
