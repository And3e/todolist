import { useSession } from 'next-auth/react'
import Router from 'next/router'
import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

function Protected() {
  const session = useSession()
  const { status, data } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') Router.replace('/auth/signin')
  }, [status])

  if (status === 'authenticated')
    return (
      <div>
        This page is Protected for special people. like{'\n'}
        {JSON.stringify(data.user, null, 2)}
        <button onClick={() => signOut()}>sign out</button>
      </div>
    )

  return <div>loading</div>
}

export default Protected
