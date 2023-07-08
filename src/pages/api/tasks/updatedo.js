import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
const _ = require('lodash')

const prisma = new PrismaClient()

async function updateTask(task) {
  await prisma.task.update({
    where: {
      id: task.id,
    },
    data: task,
  })
}

async function updateDO(updateInfo, user) {
  updateInfo = JSON.parse(updateInfo)

  let tasks = await prisma.task.findMany({
    orderBy: {
      dragOrder: 'asc',
    },
    where: {
      userId: user.id,
      done: updateInfo.done,
    },
  })

  let doN = 0

  for (let task of tasks) {
    doN++
    task.dragOrder = doN

    updateTask(task)
  }
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(403).json({ message: 'User not authenticated' })
  }

  if (!JSON.parse(req.body)) {
    return res.status(400).json({ message: 'Bad request' })
  }

  res.status(200).json(await updateDO(req.body, session.user))
}
