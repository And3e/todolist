import React from 'react'

import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState } from '@/recoil_state'

import Home from '../app/components/home'

import Head from 'next/head'

import { Notifications } from '@mantine/notifications'
import { MantineProvider } from '@mantine/core'

function App() {
  const [theme] = useRecoilState(themeState)

  return (
    <MantineProvider
      theme={{ colorScheme: theme, primaryColor: 'orange' }}
      withGlobalStyles
      withNormalizeCSS>
      <Notifications limit={3} />
      <Home />
    </MantineProvider>
  )
}

function Index() {
  return (
    <div>
      <Head>
        <link
          rel='icon'
          sizes='16x16 32x32 48x48 64x64 128x128 256x256'
          href='/favicon.ico'></link>
        <title>TO DO</title>
      </Head>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </div>
  )
}

export default Index
