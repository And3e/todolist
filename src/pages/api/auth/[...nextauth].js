import NextAuth from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'

// providers
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

const prisma = new PrismaClient()

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.JWT_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      authorize(credentials, req) {
        const { email, password } = credentials
        // perform you login logic
        // find out user from db

        if (email !== 'test@test.it' || password !== '1234') {
          throw new Error('invalid credentials')
        }

        // if everything is fine
        return { id: 2, email: 'test@test.it', name: 'Test' }
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
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
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
    signUp: '/auth/signup',
  },
}

export default NextAuth(authOptions)
