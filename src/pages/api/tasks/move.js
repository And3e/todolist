import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
const _ = require('lodash')

const prisma = new PrismaClient()

// versione a richiesta singola
/*
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
*/

// handler array multi richieste

async function updateTask(task) {
  await prisma.task.update({
    where: {
      id: task.id,
    },
    data: task,
  })
}

async function getList(top, bottom, list, tasksDB) {
  const tasks = _.cloneDeep(tasksDB)

  top.value = list[0].topIndex
  bottom.value = list[0].bottomIndex

  let downtoup

  for (let deplacement of list) {
    downtoup = false
    let { topIndex, bottomIndex } = deplacement

    if (bottomIndex < topIndex) {
      let swapv = topIndex
      topIndex = bottomIndex
      bottomIndex = swapv

      downtoup = true
    }

    if (topIndex < top.value) {
      top.value = topIndex
    }
    if (bottomIndex > bottom.value) {
      bottom.value = bottomIndex
    }

    if (downtoup) {
      // console.log('sotto a sopra')

      const temp = _.cloneDeep(tasks[bottomIndex])

      for (let i = bottomIndex; i > topIndex; i--) {
        tasks[i].content = tasks[i - 1].content
      }

      tasks[topIndex].content = temp.content
    } else {
      // console.log('sopra a sotto')

      const temp = _.cloneDeep(tasks[topIndex])

      for (let i = topIndex; i < bottomIndex; i++) {
        tasks[i].content = tasks[i + 1].content
      }

      tasks[bottomIndex].content = temp.content
    }
  }

  return tasks
}

async function moveTasks(list, user) {
  let tasks = await prisma.task.findMany({
    orderBy: {
      dragOrder: 'asc',
    },
    where: {
      userId: user.id,
      done: list[0].done,
    },
  })

  // per passaggio per riferimento
  let top = { value: null }
  let bottom = { value: null }

  // update list with changes
  let updatedList = await getList(top, bottom, list, tasks)

  // check if the updatedList is broken
  // prevent the lost of some element
  const contentSet = new Set(updatedList.map((obj) => obj.content))
  let missingContent = []
  missingContent = tasks.filter((obj) => !contentSet.has(obj.content))

  if(missingContent.length === 0) {
    // update DB
    for (let i = top.value; i < bottom.value + 1; i++) {
      let newTask = _.cloneDeep(tasks[i])

      if (newTask.content !== updatedList[i].content) {
        newTask.content = updatedList[i].content

        await updateTask(newTask)
      }
    }
  } else {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(403).json({ message: 'User not authenticated' })
  }

  if (!req.body) {
    return res.status(400).json({ message: 'Bad request' })
  }

  res.status(200).json(await moveTasks(req.body, session.user))
}
