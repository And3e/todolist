import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testPatch(body) {
  body = JSON.parse(body)
  console.log(body)

  const user = await prisma.verificationToken.update({
    where: {
      token: 'test',
    },
    data: body,
  })
}

export default function handler(req, res) {
  // let ip

  // if (req.headers['x-forwarded-for']) {
  //   ip = req.headers['x-forwarded-for'].split(',')[0]
  // }

  // ip = { ip: ip.split(':')[ip.split(':').length - 1] }

  // res.status(200).json(ip)

  // testPatch(req.body)

  res.status(200).json({ message: 'OK' })
}
