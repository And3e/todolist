import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

const prisma = new PrismaClient()

async function deleteTask(session, req, res) {
  let id = parseInt(req.query.id[0])
  let userId = req.query.id[1]

  let task = await prisma.task.findFirst({
    where: {
      id: id,
    },
  })

  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }

  if (task.userId != userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await prisma.task.delete({
    where: {
      id: id,
    },
  })
}

export default async function handler(req, res) {
  // DELETE => delete

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(403).json({ message: 'User not authenticated' })
  }

  if (req.method == 'DELETE') {
    res.status(200).json(await deleteTask(session, req, res))
  }
}
