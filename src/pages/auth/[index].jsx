import React, { useState } from 'react'

// store
import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState } from '@/recoil_state'

// providers
import { getProviders } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'

// router
import { useRouter } from 'next/router'

// tab info's
import Head from 'next/head'

import { MantineProvider, Tabs, Paper, Text } from '@mantine/core'

import './auth.css'

// components
import Login from './login.page.jsx'
import Register from './register.page.jsx'

// img
import logo from './../../app/imgs/long/logo-long.svg'

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: '/' } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}

function Auth({ providers }) {
  const [theme, setTheme] = useRecoilState(themeState)
  const [titoloAccount, setTitoloAccount] = useState('TO DO - Sign In')

  const router = useRouter()

  // useEffect(() => {
  //   // redirect if not a route
  //   const tab = router.query.index

  //   if (tab !== 'signin' && tab !== 'signup') {
  //     router.push('/')
  //   }
  // }, [])

  return (
    <MantineProvider
      theme={{ colorScheme: theme, primaryColor: 'orange' }}
      withGlobalStyles
      withNormalizeCSS>
      <div className='account-center'>
        <Head>
          <title>{titoloAccount}</title>
        </Head>
        <Paper
          shadow='md'
          radius='xl'
          p='lg'
          withBorder
          className='login-container'>
          <a href='/' style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={logo.src}
              height={60}
              className='d-inline-block align-center'
              alt='TO DO logo long'
              style={{ margin: '20px 0px 25px 0px' }}
            />
          </a>
          <Tabs
            defaultValue={router.query.index}
            radius='md'
            value={router.query.index}
            onTabChange={(value) => router.push(`/auth/${value}`)}>
            <Tabs.List position='center' grow>
              <Tabs.Tab
                value='signin'
                onClick={() => setTitoloAccount('TO DO - Sign In')}>
                <Text span fz='sm'>
                  Sign In
                </Text>
              </Tabs.Tab>
              <Tabs.Tab
                value='signup'
                onClick={() => setTitoloAccount('TO DO - Sign Up')}>
                <Text span fz='sm'>
                  Sign Up
                </Text>
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value='signin'>
              <Login providers={providers} />
            </Tabs.Panel>
            <Tabs.Panel value='signup'>
              <Register />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </div>
    </MantineProvider>
  )
}

function Index({ providers }) {
  return (
    <RecoilRoot>
      <Auth providers={providers} />
    </RecoilRoot>
  )
}

export default Index

/*
import React, { useState } from 'react'

// store
import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState } from '@/recoil_state'

// providers
import { getProviders } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'

// router
import { useRouter } from 'next/router'

// tab info's
import { Helmet } from 'react-helmet'

import { MantineProvider, Tabs, Paper, Text } from '@mantine/core'

import './auth.css'

// components
import Login from './login.jsx'
import Register from './register.jsx'

// img
import logo from './../../app/imgs/long/logo-long.svg'

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: '/' } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}

function Auth({ providers }) {
  const [theme, setTheme] = useRecoilState(themeState)
  const [titoloAccount, setTitoloAccount] = useState('Accedi')

  const router = useRouter()

  async function login() {
    //await fetch('/api/auth/signin/:github', { method: 'POST' })
  }

  return (
    <MantineProvider
      theme={{ colorScheme: theme, primaryColor: 'orange' }}
      withGlobalStyles
      withNormalizeCSS>
      <div className='account-center'>
        <Helmet>
          <title>TO DO - {titoloAccount}</title>
        </Helmet>
        <Paper
          shadow='md'
          radius='xl'
          p='lg'
          withBorder
          className='login-container'>
          <a href='/' style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={logo.src}
              height={60}
              className='d-inline-block align-center'
              alt='TO DO logo long'
              style={{ margin: '20px 0px 25px 0px' }}
            />
          </a>
          <Tabs
            defaultValue={router.query.index}
            radius='md'
            value={router.query.activeTab}
            onTabChange={(value) => router.push(`/auth/${value}`)}>
            <Tabs.List position='center' grow>
              <Tabs.Tab
                value='signin'
                onClick={() => setTitoloAccount('Sign In')}>
                <Text span fz='sm'>
                  Sign In
                </Text>
              </Tabs.Tab>
              <Tabs.Tab
                value='signup'
                onClick={() => setTitoloAccount('Sign UP')}>
                <Text span fz='sm'>
                  Sign Up
                </Text>
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value='signin'>
              <Login
                setTitoloAccount={setTitoloAccount}
                providers={providers}
              />
            </Tabs.Panel>
            <Tabs.Panel value='signup'>
              <Register setTitoloAccount={setTitoloAccount} />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </div>
    </MantineProvider>
  )
}

function Index({ providers }) {
  return (
    <RecoilRoot>
      <Auth providers={providers} />
    </RecoilRoot>
  )
}

export default Index

*/
