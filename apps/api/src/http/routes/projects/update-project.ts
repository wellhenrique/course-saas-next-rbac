import { z } from 'zod'
import { projectSchema } from '@saas/auth'
import { type FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug/projects/:projectId',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Update a project',
          description: 'Update a project',
          security: [{ BearerAuth: [] }],
          body: z.object({
            name: z.string().min(1),
            description: z.string().min(1),
          }),
          params: z.object({
            slug: z.string(),
            projectId: z.string().min(1),
          }),
          response: {
            // 200: z.object({
            //   project: z.object({
            //     id: z.string().uuid(),
            //     slug: z.string(),
            //     name: z.string(),
            //     description: z.string(),
            //     avatarUrl: z.string().url().nullable(),
            //     ownerId: z.string().uuid(),
            //     organizationId: z.string().uuid(),
            //     owner: z.object({
            //       id: z.string().uuid(),
            //       name: z.string().nullable(),
            //       avatarUrl: z.string().nullable(),
            //     }),
            //     createdAt: z.date(),
            //     updatedAt: z.date(),
            //   }),
            // }),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params
        const { name, description } = request.body

        const sub = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const project = await prisma.project.findUnique({
          select: {
            id: true,
            ownerId: true,
          },
          where: {
            slug: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found or not exists.')
        }

        const { cannot } = getUserPermissions(sub, membership.role)
        const authProject = projectSchema.parse(project)

        if (cannot('update', authProject)) {
          throw new UnauthorizedError(
            `You're not allowed to update this project.`,
          )
        }

        await prisma.project.update({
          where: {
            id: project.id,
            slug,
          },
          data: {
            name,
            description,
          },
        })

        return reply.status(200).send()
      },
    )
}
