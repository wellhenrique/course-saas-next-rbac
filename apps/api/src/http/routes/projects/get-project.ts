import { z } from 'zod'
import { type FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get project details',
          description: 'Get project details',
          security: [{ BearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string().min(1),
          }),
          response: {
            200: z.object({
              project: z.object({
                id: z.string().uuid(),
                slug: z.string(),
                name: z.string(),
                description: z.string(),
                avatarUrl: z.string().url().nullable(),
                ownerId: z.string().uuid(),
                organizationId: z.string().uuid(),

                owner: z.object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                }),

                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params
        const sub = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(sub, membership.role)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(`You're not allowed to see this project.`)
        }

        const project = await prisma.project.findUnique({
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            avatarUrl: true,
            ownerId: true,
            organizationId: true,

            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },

            createdAt: true,
            updatedAt: true,
          },
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found or not exists.')
        }

        return reply.status(200).send({ project })
      },
    )
}
