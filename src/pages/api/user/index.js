import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { genSalt, hash, compare } from 'bcryptjs'
const os = require('os')
import axios from 'axios'

const prisma = new PrismaClient()

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

async function checkEmail(email){
  const users = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (users.length > 0) {
    // Account already exists
    return false
  }
}

async function checkDate(req, reqdate) {
  const deviceIP = await getClientIp()
  const deviceMAC = getMACAddress()

  if (deviceIP != null) {
    const usersByIP = await prisma.user.findMany({
      where: {
        deviceIP: deviceIP,
      },
    })

    const requestDate = new Date(reqdate)
    // 2 hours before the request date

    const matchingUsersIP = usersByIP.filter((user) => {
      const matchingDate = new Date(user.creationDate)
      
      const matchingDatePrec = new Date(user.creationDate)
      matchingDatePrec.setMinutes(matchingDatePrec.getMinutes() - 30)
      
      return matchingDatePrec <= requestDate && matchingDate <= requestDate
    })

    if (matchingUsersIP.length > 0) {
      // Other accounts are created by the same IP within the 2-hour range
      console.log('FALSO COME IL PANE')
      return false
    }
  }

  if (deviceMAC != null) {
    const usersByMAC = await prisma.user.findMany({
      where: {
        deviceMAC: deviceMAC,
      },
    })

    const requestDate = new Date(reqdate)
    // 2 hours before the request date
    const matchingUsersMAC = usersByMAC.filter((user) => {
      const matchingDate = new Date(user.creationDate)

      const matchingDatePrec = new Date(user.creationDate)
      matchingDatePrec.setMinutes(matchingDatePrec.getMinutes() - 30)

      return matchingDatePrec <= requestDate && matchingDate <= requestDate
    })

    if (matchingUsersMAC.length > 0) {
      console.log('FALSO COME IL MAC')
      // Other accounts are created by the same MAC within the 2-hour range
      return false
    }
  }

  // No other accounts found
  // OR
  // No other accounts found for the same IP or MAC within the 2-hour range
  return true
}

function getMACAddress() {
  const networkInterfaces = os.networkInterfaces()
  const interfaceKeys = Object.keys(networkInterfaces)

  // Iterate through network interfaces to find the MAC address
  for (const key of interfaceKeys) {
    const networkInterface = networkInterfaces[key]
    const matchingInterface = networkInterface.find(
      (iface) =>
        iface.mac &&
        iface.mac !== '00:00:00:00:00:00' &&
        iface.internal === false
    )

    if (matchingInterface) {
      return matchingInterface.mac
    }
  }

  return null
}

async function getClientIp() {
  try {
    const response = await axios.get(`https://api.ipify.org/?format=json`)
    const { ip } = response.data

    return ip
  } catch (error) {
    console.error('Error retrieving IP: ', error)
    return null
  }
}

async function createUser(session, req, res) {
  let requestUser = JSON.parse(req.body)

  const outPassword = await encryptPassword(requestUser.password)

  if (!(await checkEmail(requestUser.email))) {
    return res
      .redirect('/api/auth/error?error=account%20already%20exists', 403)
    return res
      .status(409)
      .json({ message: 'Conflict - Account already exists' })
  } else if (!(await checkDate(req, requestUser.creationDate))) {
    return res
      .status(429)
      .json({
        message: 'Too Many Requests - You have already created an account recently, please try again shortly!',
      })
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
      deviceIP: requestUser.deviceIP,
      deviceMAC: requestUser.deviceMAC,
    },
  })
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
