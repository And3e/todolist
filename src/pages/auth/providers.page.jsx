import { signIn } from 'next-auth/react'

import { Button, Divider, Text } from '@mantine/core'

function Providers({ providers }) {
  function getProviderProps(name, color) {
    let out = null

    switch (name) {
      case 'GitHub': {
        if (color) {
          out = 'dark'
        } else {
          out = 'https://authjs.dev/img/providers/github-dark.svg'
        }
        break
      }
      case 'Google': {
        if (color) {
          out = 'blue'
        } else {
          out = 'https://authjs.dev/img/providers/google.svg'
        }
        break
      }
    }

    return out
  }

  if (providers) {
    return (
      <div className='providers-container'>
        <Divider
          className='divider'
          my='xs'
          variant='dashed'
          labelPosition='center'
          label={<Text fz='sm'>Or</Text>}
        />
        {Object.values(providers).map((provider) => {
          if (provider.id === 'credentials') {
            return null
          }
          return (
            <div key={provider.id}>
              <Button
                w='100%'
                radius='xl'
                color={getProviderProps(provider.name, true)}
                onClick={() => signIn(provider.id)}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                  <img
                    src={getProviderProps(provider.name, false)}
                    height={25}
                  />
                  Sign in with {provider.name}
                </div>
              </Button>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Providers
