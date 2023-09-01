import React, { useState, useEffect, forwardRef } from 'react'

// store
import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState, languagesOutSelector } from '@/recoil_state'

// providers
import { getProviders } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'

// router
import { useRouter } from 'next/router'

// tab info's
import Head from 'next/head'

import {
  MantineProvider,
  useMantineTheme,
  Tabs,
  Paper,
  Text,
  AppShell,
  Header,
  Select,
  Switch,
} from '@mantine/core'

import { GB, IT, FR } from 'country-flag-icons/react/3x2'
import { IconSun, IconMoonStars } from '@tabler/icons-react'

import './auth.css'

// components
import Login from './login.page.jsx'
import Register from './register.page.jsx'

// img
import logo from '@/app/imgs/long/logo-long.svg'

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
  const [language, setLanguage] = useRecoilState(languagesOutSelector)

  const mantineTheme = useMantineTheme()

  const [accountTitle, setAccountTitle] = useState(language.home.title_signin)
  const router = useRouter()

  useEffect(() => {
    // redirect if not a route
    const tab = router.query.index

    if (tab !== 'signin' && tab !== 'signup') {
      router.push('/404')
    }

    if (tab === 'signup') {
      setAccountTitle(language.home.title_signup)
    }
  }, [])

  const data = [
    {
      value: 'English',
      label: 'English',
      flag: (
        <div className='lang-control'>
          <GB title='English' height='20px' style={{ borderRadius: '5px' }} />
        </div>
      ),
    },
    {
      value: 'Italiano',
      label: 'Italiano',
      flag: (
        <div className='lang-control'>
          <IT title='Italiano' height='20px' style={{ borderRadius: '5px' }} />
        </div>
      ),
    },
    {
      value: 'Français',
      label: 'Français',
      flag: (
        <div className='lang-control'>
          <FR title='Français' height='20px' style={{ borderRadius: '5px' }} />
        </div>
      ),
    },
  ]

  const SelectItem = forwardRef(({ flag, ...others }, ref) => (
    <div ref={ref} {...others} style={{ borderRadius: '20px' }}>
      {flag}
    </div>
  ))

  return (
    <MantineProvider
      theme={{ colorScheme: theme, primaryColor: 'orange' }}
      withGlobalStyles
      withNormalizeCSS>
      <AppShell
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],

            padding: '0px',
          },
        })}
        header={
          <Header
            sx={(theme) => ({
              backgroundColor: 'transparent',
              border: 0,
            })}
            className='header'>
            <Switch
              labelPosition='left'
              value='tema'
              size='md'
              color='gray'
              defaultChecked={theme === 'dark'}
              onChange={(event) => {
                if (event.currentTarget.checked) {
                  setTheme('dark')
                } else {
                  setTheme('light')
                }
              }}
              onLabel={
                <IconMoonStars
                  size='1rem'
                  stroke={2.5}
                  color={mantineTheme.colors.blue[6]}
                />
              }
              offLabel={
                <IconSun
                  size='1rem'
                  stroke={2.5}
                  color={mantineTheme.colors.yellow[7]}
                />
              }
            />
            <Select
              radius='xl'
              w={100}
              itemComponent={SelectItem}
              data={data}
              maxDropdownHeight={200}
              defaultValue='English'
              defaultChecked='English'
              onChange={(flag) => {
                let out = 'en'

                if (flag === 'Italiano') {
                  out = 'it'
                } else if (flag === 'Français') {
                  out = 'fr'
                }

                setLanguage(out)
              }}
            />
          </Header>
        }>
        <div className='account-center'>
          <Head>
            <title>{accountTitle}</title>
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
              onTabChange={(route) => {
                router.push(`/auth/${route}`)
              }}
              keepMounted={false}>
              <Tabs.List position='center' grow>
                <Tabs.Tab
                  value='signin'
                  onClick={() => setAccountTitle(language.home.title_signin)}>
                  <Text span fz='sm'>
                    {language.login.signin}
                  </Text>
                </Tabs.Tab>
                <Tabs.Tab
                  value='signup'
                  onClick={() => setAccountTitle(language.home.title_signup)}>
                  <Text span fz='sm'>
                    {language.register.signup}
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
      </AppShell>
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
