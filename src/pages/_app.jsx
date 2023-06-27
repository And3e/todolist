import React from 'react'

import { SessionProvider } from 'next-auth/react'

import { RecoilRoot } from 'recoil'

import Home from '../app/components/home'

export default function App({ pageProps: { session } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Home />
      </RecoilRoot>
    </SessionProvider>
  )
}
