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

async function updateDO(user) {

  let tasks = await prisma.task.findMany({
    orderBy: {
      dragOrder: 'asc',
    },
    where: {
      userId: user.id,
    },
  })

  let doneList = tasks.filter((task) => task.done === true)
  let notDoneList = tasks.filter((task) => task.done === false)

  let doN = 0

  for (let task of doneList) {
    doN++
    task.dragOrder = doN

    updateTask(task)
  }
 
  doN = 0

  for (let task of notDoneList) {
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

  res.status(200).json(await updateDO(session.user))
}
