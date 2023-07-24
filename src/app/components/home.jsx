'use client'

import React, { useState, useEffect } from 'react'

// router
import { useRouter } from 'next/navigation'

// auth
import { useSession } from 'next-auth/react'

// store
import { useRecoilState } from 'recoil'
import { taskState } from '../../recoil_state'

import { Center, AppShell, Header, Paper, Button, Text } from '@mantine/core'

import './home.css'

// components
import Input from './input'
import List from './list/list'
import UserBtn from './btns/userbtn'

// img
import logo from './../imgs/long/logo-long.svg'

export default function Home() {
  const { push } = useRouter()
  const [tasks, setTasks] = useRecoilState(taskState)

  const session = useSession()

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

  if (session.status === 'authenticated') {
    return (
      <AppShell
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
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
            <UserBtn />
          </Header>
        }>
        <Center className='center-h'>
          <Paper
            className='container'
            shadow='xl'
            radius='xl'
            p='md'
            withBorder>
            <Center style={{ display: 'grid', gap: '10px' }}>
              <img
                src={logo.src}
                height={70}
                style={{ margin: '10px 0px 20px 0px' }}
              />
            </Center>
            <Input />
            <List />
            {/* <Dnd /> */}
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
