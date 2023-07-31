import React from 'react'

// auth
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { useForm } from '@mantine/form'

import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Divider,
  ScrollArea,
} from '@mantine/core'

function Register() {
  const { push } = useRouter()

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
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      name: (value) =>
        value.length < 2 ? 'Il nome deve avere almeno 2 lettere!' : null,
      surname: (value) =>
        value.length < 2 ? 'Il cognome deve avere almeno 2 lettere!' : null,
      email: validateEmail,
      password: undefined,
      confirmPassword: (value, values) =>
        value !== values.password ? 'Le passwords non corrispondono!' : null,
    },
  })

  return (
    <Box style={{ marginLeft: '12px' }}>
      <ScrollArea
        className='center-form'
        h={450}
        offsetScrollbars
        scrollHideDelay={100}>
        <form
          onSubmit={form.onSubmit(async (fields) => {
            // create user
            let newUser = {
              name: fields.name,
              email: fields.email,
              surname: fields.surname,
              password: fields.password,
              creationDate: new Date(),
            }

            await fetch('/api/user', {
              method: 'POST',
              body: JSON.stringify(newUser),
            })
              .then((res) => {
                console.log(res)

                if (res.redirected) {
                  push(res.url)
                } else {
                  signIn('credentials', {
                    email: fields.email,
                    password: fields.password,
                    redirect: true,
                    callbackUrl: '/',
                  })
                }
              })
              .catch((error) => {
                console.error('Error during fetch: ', error)
              })
          })}>
          <TextInput
            label='Name'
            placeholder='Name'
            radius='xl'
            className='input-margin-top'
            {...form.getInputProps('name')}
          />
          <TextInput
            label='Surname'
            placeholder='Surname'
            radius='xl'
            className='input-margin-top'
            {...form.getInputProps('surname')}
          />

          <Divider my='sm' style={{ marginTop: '20px' }} />

          <TextInput
            mt='sm'
            label='Email'
            placeholder='Email'
            radius='xl'
            className='input-margin-top'
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label='Password'
            placeholder='Password'
            radius='xl'
            className='input-margin-top'
            toggleTabIndex={0}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            mt='sm'
            label='Confirm password'
            placeholder='Confirm password'
            toggleTabIndex={0}
            radius='xl'
            className='input-margin-top'
            {...form.getInputProps('confirmPassword')}
          />

          <div className='input-center input-margin-top'>
            <Button radius='xl' type='submit' mt='sm'>
              Sign Up
            </Button>
          </div>
        </form>
      </ScrollArea>
    </Box>
  )
}

export default Register
