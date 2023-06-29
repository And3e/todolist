import React from 'react'

// poviders
import Providers from './providers.page'

import { signIn } from 'next-auth/react'

import { useForm } from '@mantine/form'
import {
  PasswordInput,
  TextInput,
  Button,
  Box,
  ScrollArea,
} from '@mantine/core'

function Login({ providers }) {
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Mail non valida!'
    }
    const parts = value.split('@')
    if (parts.length !== 2) {
      return 'Mail non valida!'
    }
    const domain = parts[1]
    if (domain.includes('.') && domain.split('.').length < 2) {
      return 'Dominio mail non valido!'
    }
    return undefined
  }

  const form = useForm({
    initialValues: { email: '', password: '' },

    validate: {
      email: validateEmail,
    },
  })

  return (
    <Box style={{ marginLeft: '12px' }}>
      <ScrollArea
        className='center-form'
        h={providers ? 450 : 220}
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
