import { z } from 'zod'
import { type FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'

import { BadRequestError } from '../_errors/bad-request-error'

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Accept an invite',
          description: 'Accept an invite',
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params
        const sub = await request.getCurrentUserId()

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found or not expired.')
        }

        const user = await prisma.user.findUnique({
          where: {
            id: sub,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found or not exists.')
        }

        if (invite.email !== user.email) {
          throw new BadRequestError('This invite belongs to another user.')
        }

        await prisma.$transaction([
          prisma.member.create({
            data: {
              userId: sub,
              organizationId: invite.organizationId,
              role: invite.role,
            },
          }),
          prisma.invite.delete({
            where: {
              id: inviteId,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
