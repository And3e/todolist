import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { genSalt, hash } from 'bcryptjs'

const os = require('os')

const prisma = new PrismaClient()

const checkDateIntervall = 30 * 60000 // 30 minutes

// Return
function returnRedirectError(res, message, statusCode) {
  let outMessage = message.replace(/ /g, '%20').toLowerCase()
  return res.redirect('/api/auth/error?error=' + outMessage, statusCode)
}

function returnRedirect(res, url, statusCode) {
  return res.redirect(url, statusCode)
}

// Methods functions

async function getUser(session) {
  // return await prisma.task.findMany({
  //   where: {
  //     userId: session.user.id,
  //   },
  // })
}

async function encryptPassword(password) {
  try {
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)
    return hashedPassword
  } catch (err) {
    console.error('Error encrypting password:', err)
    return null
  }
}

async function checkEmail(email) {
  const users = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (users) {
    // Account already exists
    return false
  }

  return true
}

function getClientIp(req) {
  let ip = null

  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0]
    ip = ip.split(':')[ip.split(':').length - 1]
  }

  return ip
}

async function checkDate(req, reqdate) {
  const deviceIP = getClientIp(req)

  if (deviceIP != null) {
    const usersByIP = await prisma.user.findMany({
      where: {
        deviceIP: deviceIP,
      },
    })

    const requestDate = new Date(reqdate)

    let out = true
    const matchingUsersIP = usersByIP.filter((user) => {
      const matchingDate = new Date(user.creationDate)

      // if for preventing others results
      if (
        requestDate.getTime() - matchingDate.getTime() <=
        checkDateIntervall
      ) {
        out = false
      }
    })

    if (!out) {
      return false
    }

    if (matchingUsersIP.length > 0) {
      // Other accounts are created by the same IP within the 2-hour range
      return false
    }
  }

  // No other accounts found
  // OR
  // No other accounts found for the same IP within the 30 minutes range
  return true
}

async function createUser(session, req, res) {
  let requestUser = JSON.parse(req.body)

  const outPassword = await encryptPassword(requestUser.password)

  if (!(await checkEmail(requestUser.email))) {
    // 409 Conflict - Account already exists
    returnRedirectError(res, 'Account already exists', 403)
  } else if (!(await checkDate(req, requestUser.creationDate))) {
    returnRedirectError(
      res,
      'Too Many Requests - You have already created an account recently, please try again shortly!',
      429
    )
  }

  console.log('CREATE')
  console.log(requestUser)

  await prisma.user.create({
    data: {
      name: requestUser.name,
      email: requestUser.email,
      surname: requestUser.surname,
      password: outPassword,
      creationDate: requestUser.creationDate,
      deviceIP: getClientIp(req),
    },
  })

  returnRedirect(res, '/auth/success', 200)
}

async function editUser(session, req) {
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
  // POST => create
  // PATCH => edit

  const session = await getServerSession(req, res, authOptions)

  if (!session && req.method !== 'POST') {
    return res.status(403).json({ message: 'User not authenticated' })
  }

  switch (req.method) {
    case 'POST': {
      res.status(200).json(await createUser(session, req, res))
      break
    }
    case 'PATCH': {
      res.status(200).json(await editUser(session, req))
      break
    }
  }
}
