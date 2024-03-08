import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { genSalt, hash } from 'bcryptjs'

const prisma = new PrismaClient()

const checkDateIntervall = 30 * 60000 // 30 minutes

// Return
function returnRedirectError(res, message, urlMessage, statusCode) {
  res.status(statusCode)
  res.json({ message: message, redirect: '/auth/signup?error=' + urlMessage })
  return res.redirect('/auth/signup?error=' + urlMessage, statusCode)
}

// Methods functions

async function getUser(session, res) {
  let out = null

  let user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  out = {
    creationDate: user.creationDate,
    email: user.email,
    emailVerified: user.emailVerified,
    id: user.id,
    image: user.image,
    colorScheme: user.colorScheme,
    language: user.language,
    name: user.name,
    provider: user.provider,
    surname: user.surname,
  }

  return out
}

// createUser

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

// function getAvatar(name, surname) {
//   let apiUrl = 'https://ui-avatars.com/api/?name='

//   // no check => control in input
//   apiUrl += name.at(0) + surname.at(0)
//   apiUrl += '&background=random&rounded=true&bold=true&format=svg'

//   return apiUrl
// }

function getRandomColor() {
  const colors = [
    'red',
    'pink',
    'grape',
    'violet',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'orange',
  ]

  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

function getAvatar(name, surname) {
  let avatarInfo = '$' + getRandomColor() + '#'

  // no check => control in input
  avatarInfo += name.at(0) + surname.at(0)

  return avatarInfo
}

async function createUser(req, res) {
  console.log(await req.body)
  let requestUser = await req.body

  const outPassword = await encryptPassword(requestUser.password)

  if (!(await checkEmail(requestUser.email))) {
    // 409 Conflict - Account already exists
    returnRedirectError(
      res,
      'Account already exists',
      'account-already-exists',
      409
    )
  } else if (!(await checkDate(req, requestUser.creationDate))) {
    returnRedirectError(
      res,
      'Too Many Requests - You have already created an account recently, please try again shortly!',
      'too-many-requests',
      429
    )
  }

  console.log('CREATE')
  console.log(requestUser)

  let avatar = null
  avatar = getAvatar(requestUser.name, requestUser.surname)

  await prisma.user.create({
    data: {
      name: requestUser.name,
      email: requestUser.email,
      surname: requestUser.surname,
      password: outPassword,
      creationDate: requestUser.creationDate,
      deviceIP: getClientIp(req),
      image: avatar,
      colorScheme: 'dark',
      language: 'en',
    },
  })

  return res.status(200).json({ message: 'OK' })
}

async function editUser(session, req, res) {
  let requestUser = req.body

  let user = await prisma.user.findFirst({
    where: {
      id: requestUser.id,
    },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (session.user.id != user.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (requestUser.email && !(await checkEmail(requestUser.email))) {
    // 409 Conflict - Account already exists
    return res.status(409).json({ message: 'Account already exists' })
  }

  await prisma.user.update({
    where: {
      id: requestUser.id,
    },
    data: requestUser,
  })
}

async function deleteUser(session, res) {
  let requestUser = session.user

  let user = await prisma.user.findFirst({
    where: {
      id: requestUser.id,
    },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  // prevenzione - "in teoria" mai
  if (session.user.id != user.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await prisma.user.delete({
    where: {
      id: requestUser.id,
    },
  })
}

export default async function handler(req, res) {
  // GET => get info
  // POST => create user
  // PATCH => edit info
  // DELETE => delete account

  const session = await getServerSession(req, res, authOptions)

  if (!session && req.method.toUpperCase() !== 'POST') {
    return res.status(403).json({ message: 'User not authenticated' })
  }

  switch (req.method.toUpperCase()) {
    case 'GET': {
      res.status(200).json(await getUser(session, res))
      break
    }
    case 'POST': {
      res.status(200).json(await createUser(req, res))
      break
    }
    case 'PATCH': {
      res.status(200).json(await editUser(session, req, res))
      break
    }
    case 'DELETE': {
      res.status(200).json(await deleteUser(session, res))
      break
    }
  }
}
