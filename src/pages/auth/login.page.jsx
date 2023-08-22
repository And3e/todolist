import React, { useEffect } from 'react'

import { signIn } from 'next-auth/react'

// router
import { useRouter } from 'next/router'

import { useForm } from '@mantine/form'
import {
  PasswordInput,
  TextInput,
  Button,
  Box,
  ScrollArea,
  Divider,
  Text,
} from '@mantine/core'

export function Providers({ providers }) {
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

export function Login({ providers }) {
  const router = useRouter()

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Invalid mail!'
    }
    const parts = value.split('@')
    if (parts.length !== 2) {
      return 'Invalid mail!'
    }
    const domain = parts[1]
    if (domain.includes('.') && domain.split('.').length < 2) {
      return 'Invalid mail domain!'
    }
    return undefined
  }

  const form = useForm({
    initialValues: { email: '', password: '' },
    clearInputErrorOnChange: false,

    validate: {
      email: validateEmail,
    },
  })

  useEffect(() => {
    if (form.isTouched('email') || form.isTouched('password')) {
      const elementsWithClass = document.querySelectorAll(
        '.mantine-InputWrapper-error'
      )

      elementsWithClass.forEach((element) => {
        element.classList.add('unmounted')
      })

      setTimeout(() => {
        form.clearErrors()
      }, 200)
    }
  }, [form.isTouched('email'), form.isTouched('password')])

  function getMessage(error) {
    let out = 'Login error, try again!'

    let receivedError = error.split('@')[0]
    let provider = error.split('@')[1]
      ? error.split('@')[1]
      : 'Google or GitHub'

    switch (receivedError) {
      case 'invalid-credentials': {
        out = 'Invalid credentials, wrong mail or password'
        break
      }
      case 'invalid-provider': {
        out =
          'Invalid provider, try with the ' +
          provider.at(0).toUpperCase() +
          provider.slice(1) +
          ' button'

        break
      }
    }

    return out
  }

  useEffect(() => {
    if (router.query.error) {
      form.setErrors({
        email: getMessage(router.query.error),
        password: getMessage(router.query.error),
      })
    }
  }, [])

  function countNonEmptyValues(obj) {
    let count = 0

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== '') {
        count++
      }
    }

    return count
  }

  function loginHeight() {
    let height = 390

    if (providers) {
      height += 18 * countNonEmptyValues(form.errors)
    } else {
      height = 220 + 18 * countNonEmptyValues(form.errors)
    }

    return height
  }

  return (
    <Box style={{ marginLeft: '12px' }}>
      <ScrollArea
        className='center-form'
        h={loginHeight()}
        offsetScrollbars
        scrollHideDelay={100}>
        <form
          onSubmit={form.onSubmit(async (fields) => {
            await signIn('credentials', {
              email: fields.email,
              password: fields.password,
              redirect: true,
              callbackUrl: '/',
            })
          })}>
          <TextInput
            mt='sm'
            radius='xl'
            label='Email'
            placeholder='Email'
            className='input-margin-top'
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label='Password'
            radius='xl'
            placeholder='Password'
            className='input-margin-top'
            toggleTabIndex={0}
            {...form.getInputProps('password')}
          />

          <div className='input-center input-margin-top'>
            <Button radius='xl' type='submit' mt='sm'>
              Sign In
            </Button>
          </div>
        </form>

        <Providers providers={providers} />
      </ScrollArea>
    </Box>
  )
}

export default Login
