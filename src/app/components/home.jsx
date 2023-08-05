'use client'

import React, { useEffect } from 'react'

// router
import { useRouter } from 'next/navigation'

// auth
import { useSession } from 'next-auth/react'

// store
import { useRecoilState } from 'recoil'
import { taskState, themeState, userState } from '@/recoil_state'

// tab's info
import Head from 'next/head'

import { useDisclosure } from '@mantine/hooks'
import { Center, AppShell, Header, Paper, Button, Text } from '@mantine/core'

import './home.css'

// components
import Input from './input'
import List from './list/list'
import UserBtn from './btns/userbtn'
import Profile from './profile/profile'

// img
import logo from './../imgs/long/logo-long.svg'

export default function Home() {
  const { push } = useRouter()
  const [tasks, setTasks] = useRecoilState(taskState)
  const [user, setUser] = useRecoilState(userState)
  const [theme, setTheme] = useRecoilState(themeState)

  const session = useSession()

  // profile modal
  const [opened, { open, close }] = useDisclosure(false)

  async function fetchData() {
    // pull list from db
    const response = await fetch('/api/tasks')
    const data = await response.json()
    setTasks(data)
  }

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      push('/auth/signin')
    } else if (session.status === 'authenticated') {
      fetchData()
    }
  }, [session.status])

  useEffect(() => {
    if (user && user.colorScheme !== theme) {
      setTheme(user.colorScheme)
    }
  }, [user])

  if (session.status === 'authenticated') {
    return (
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
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
              border: 0,
            })}
            className='header'>
            <UserBtn opened={opened} open={open} close={close} />
          </Header>
        }>
        <Head>
          <title>TO DO{user ? ' - ' + user.name : ''}</title>
        </Head>
        <Profile opened={opened} close={close} />
        <Center className='center-h'>
          <Paper
            className='container'
            shadow='xl'
            radius='xl'
            p='md'
            withBorder>
            <Center style={{ display: 'grid', gap: '10px' }}>
              <a href='/'>
                <img src={logo.src} className='logo' />
              </a>
            </Center>
            <Input />
            <List />
          </Paper>
        </Center>
      </AppShell>
    )
  }
  return (
    <Center h='100vh' style={{ display: 'grid' }}>
      <div style={{ display: 'grid', gap: '20px' }}>
        <Text fz='xl'>You're not logged in!</Text>
        <Button radius='xl' onClick={() => push('/auth/signin')}>
          <Text fz='md'>Sign In</Text>
        </Button>
      </div>
    </Center>
  )
}
