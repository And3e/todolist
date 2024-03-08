import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}
