import NextAuth from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'

// providers
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const prisma = new PrismaClient()

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.JWT_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        })

        if (user) {
          const res = await compare(password, user.password)
          if (res) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              surname: user.surname,
              image: user.image,
            }
          } else {
            throw new Error('Invalid credentials')
          }
        } else {
          throw new Error('Invalid credentials')
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  callbacks: {
    jwt({ user, token }) {
      if (user?.role) {
        token.role = user.role
      }

      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
      }

      // CSP - Content Security Policy
      session.permissionsPolicy = 'geolocation=(), microphone=()'

      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      })
      const provider = await prisma.account.findMany({
        where: {
          userId: session.user.id,
        },
      })

      // surname
      if (typeof user.surname === 'undefined') {
        let name = 'Undefined'
        let surname = 'Undefined'

        const names = user.name.split(' ')

        if (names.length === 1) {
          name = user.name
        } else if (names.length === 2) {
          name = names[0]
          surname = names[1]
        } else {
          name = names[0]

          for (let i = 1; i < names.length; i++) {
            surname += '' + names[i] + ' '
          }

          surname = surname.trim()
        }

        prisma.user.update({
          where: {
            email: session.user.email,
          },
          data: {
            name: name,
            surname: surname,
          },
        })
      }

      session.user.surname = user.surname ? user.surname : null
      session.user.emailVerified = user.emailVerified
      session.user.creationDate = user.creationDate

      // colorScheme
      if (typeof user.colorScheme === 'undefined') {
        prisma.user.update({
          where: {
            email: session.user.email,
          },
          data: {
            colorScheme: 'dark',
          },
        })
      }
      session.user.colorScheme = user.colorScheme ? user.colorScheme : 'dark'
      session.user.provider = 'undefined'

      if (provider.length > 0) {
        session.user.provider = provider[0].provider
      }

      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/signup', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
}

export default NextAuth(authOptions)
