import React, { useEffect } from 'react'

import { Notifications } from '@mantine/notifications'
import { MantineProvider, Center, AppShell, Paper } from '@mantine/core'

import { useSession, signIn, signOut } from 'next-auth/react'

import { useRecoilState } from 'recoil'
import { themeState, taskState } from '../../recoil_state'
import './home.css'

// components
import Input from './input'
import List from './list'

export default function App() {
  const [theme, setTheme] = useRecoilState(themeState)
  const [tasks, setTasks] = useRecoilState(taskState)

  const { data: session } = useSession()

  useEffect(() => {
    async function fetchData() {
      // pull list from db
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data)
    }

    fetchData()
  }, [])

  if (session) {
    return (
      <MantineProvider
        theme={{ colorScheme: theme, primaryColor: 'orange' }}
        withGlobalStyles
        withNormalizeCSS>
        <Notifications limit={3} />
        <AppShell
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}>
          <Center className='center-h'>
            <Paper
              className='container'
              shadow='xl'
              radius='xl'
              p='md'
              withBorder>
              <Center>
                <h1>TO DO</h1>
              </Center>
              <Input />
              <List />
            </Paper>
          </Center>
        </AppShell>
      </MantineProvider>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
