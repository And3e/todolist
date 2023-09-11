'use client'

import React, { useState, useEffect, useRef } from 'react'

// router
import { useRouter } from 'next/navigation'

// api calls
import axios from 'axios'

// auth
import { useSession } from 'next-auth/react'

// store
import { useRecoilState } from 'recoil'
import {
  taskState,
  themeState,
  userState,
  paperState,
  languagesInSelector,
} from '@/recoil_state'

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

  const [user] = useRecoilState(userState)
  const [theme, setTheme] = useRecoilState(themeState)
  const [language, setLanguage] = useRecoilState(languagesInSelector)

  const [paperWidth, setPaperWidth] = useRecoilState(paperState)

  const containerRef = useRef(null)

  const initialHeight =
    typeof window !== 'undefined' ? window.innerHeight : 'calc(100vh - 70px)'
  const [windowHeight, setWindowHeight] = useState(initialHeight)

  const session = useSession()

  // profile modal
  const [opened, { open, close }] = useDisclosure(false)

  async function fetchData() {
    // pull list from db
    const response = await axios('/api/tasks').catch((error) => {
      console.error(error)
    })
    const data = await response.data
    setTasks(data)
  }

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      push('/auth/signin')
    } else if (session.status === 'authenticated') {
      fetchData()
    }
  }, [session.status])

  async function setDefault() {
    let updateInfos = {
      id: user.id,
      language: 'en',
      colorScheme: 'dark',
    }

    // determinate first name & surname ==> only if default (beginning)
    let provider = session.data.user.provider

    if (provider === 'google' || provider === 'github') {
      let firstName = user.name
      let secondName = user.surname

      let names = firstName.split(' ')

      if (names.length > 1 && !secondName) {
        let first = true

        for (let name in names) {
          if (first) {
            updateInfos.name = name
            first = false
          } else {
            updateInfos.name = surname
          }
        }
      }
    }

    await axios({
      url: '/api/user',
      method: 'patch',
      data: updateInfos,
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    if (user) {
      if (user.language) {
        setLanguage(user.language)
      }

      if (user.colorScheme && user.colorScheme !== theme) {
        setTheme(user.colorScheme)
      }

      if (!user.language || !user.colorScheme) {
        setDefault()
      }
    }
  }, [user])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowHeight(window.innerHeight)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  function handleResize() {
    if (containerRef.current) {
      setPaperWidth(containerRef.current.clientWidth)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(handleResize, [containerRef.current])

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
            style={{ height: `calc(${windowHeight}px - 70px)` }}
            ref={containerRef}
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
