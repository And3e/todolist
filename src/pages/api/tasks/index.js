import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

const prisma = new PrismaClient()

async function getTasks(session) {
  return await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      dragOrder: 'asc',
    },
  })
}

async function pushTask(session, req) {
  let requestTask = JSON.parse(req.body)

  requestTask.userId = session.user.id

  await prisma.task.create({
    data: {
      content: requestTask.content,
      userId: session.user.id,
      dragOrder: requestTask.dragOrder,
      done: false,
    },
  })
}

async function editTask(session, req) {
  let requestTask = JSON.parse(req.body)

  let task = await prisma.task.findFirst({
    where: {
      id: requestTask.id,
    },
  })

  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }

  if (task.userId != requestTask.userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await prisma.task.update({
    where: {
      id: requestTask.id,
    },
    data: requestTask,
  })
}

export default async function handler(req, res) {
  // GET => query
  // POST => create
  // PATCH => edit

  const session = await getServerSession(req, res, authOptions)
prisma
  if (!session) {
    return res.status(403).json({ message: 'User not authenticated' })
  }

  switch (req.method) {
    case 'GET': {
      res.status(200).json(await getTasks(session))
      break
    }
    case 'POST': {
      res.status(200).json(await pushTask(session, req))
      break
    }
    case 'PATCH': {
      res.status(200).json(await editTask(session, req))
      break
    }
  }
}
