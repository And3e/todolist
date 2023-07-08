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

async function moveTask(toMoveInfo, user) {
  toMoveInfo = JSON.parse(toMoveInfo)

  let tasks = await prisma.task.findMany({
    orderBy: {
      dragOrder: 'asc',
    },
    where: {
      userId: user.id,
      done: toMoveInfo.done,
    },
  })

  
  let { topIndex, bottomIndex } = toMoveInfo

  if (tasks) {
    if (bottomIndex < topIndex) {
      let swapv = topIndex
      topIndex = bottomIndex
      bottomIndex = swapv

      const last = _.cloneDeep(tasks[bottomIndex])

      // console.log('temp', temp)

      // console.log('topIndex', topIndex)
      // console.log('bottomIndex', bottomIndex)

      for (let i = bottomIndex; i > topIndex; i--) {
        let newTask = _.cloneDeep(tasks[i])
        newTask.content = tasks[i - 1].content

        await updateTask(newTask)
      }

      let newTask = _.cloneDeep(tasks[topIndex])
      newTask.content = last.content

      await updateTask(newTask)
    } else {
      const first = _.cloneDeep(tasks[topIndex])
      // console.log('temp', temp)

      // console.log('topIndex', topIndex)
      // console.log('bottomIndex', bottomIndex)

      for (let i = topIndex; i < bottomIndex; i++) {
        let newTask = _.cloneDeep(tasks[i])
        newTask.content = _.cloneDeep(tasks[i + 1].content)

        await updateTask(newTask)
      }

      let newTask = _.cloneDeep(tasks[bottomIndex])
      newTask.content = first.content

      await updateTask(newTask)
    }
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

  res.status(200).json(await moveTask(req.body, session.user))
}
