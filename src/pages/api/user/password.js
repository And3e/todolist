import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { compare, genSalt, hash } from 'bcryptjs'

const prisma = new PrismaClient()

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

async function changePassword(session, req, res) {
  let requestData = req.body

  let user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const oldCheck = await compare(requestData.oldPswd, user.password)

  if(oldCheck) {
    const changedPassword = await encryptPassword(requestData.newPswd)

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: { password: changedPassword },
    })
  } else {
    return res.status(403).json({ message: 'Old passwords do not match' })
  }
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session && req.method.toUpperCase() !== 'POST') {
    return res.status(403).json({ message: 'User not authenticated' })
  }

  switch (req.method.toUpperCase()) {
    case 'PATCH': {
      res.status(200).json(await changePassword(session, req, res))
      break
    }
  }
}
