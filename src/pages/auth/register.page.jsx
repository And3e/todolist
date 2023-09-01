import React, { useEffect, useState } from 'react'

// auth
import { signIn } from 'next-auth/react'

// router
import { useRouter } from 'next/router'

// store
import { useRecoilState } from 'recoil'
import { languagesOutSelector } from '@/recoil_state'

// api calls
import axios from 'axios'

import { useForm } from '@mantine/form'

import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Divider,
  ScrollArea,
  Loader,
} from '@mantine/core'

export function Register({ language }) {
  // const [language] = useRecoilState(languagesOutSelector)

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return language.register.errors.invalid_mail
    }
    const parts = value.split('@')
    if (parts.length !== 2) {
      return language.register.errors.invalid_mail
    }
    const domain = parts[1]
    if (domain.includes('.') && domain.split('.').length < 2) {
      return language.register.errors.invalid_mail_domain
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
    clearInputErrorOnChange: false,

    validate: {
      name: (value) =>
        value.length < 2 ? language.register.errors.name_must_have : null,
      surname: (value) =>
        value.length < 2 ? language.register.errors.surname_must_have : null,
      email: validateEmail,
      password: undefined,
      confirmPassword: (value, values) =>
        value !== values.password
          ? language.register.errors.passwords_do_not_match
          : null,
    },
  })

  // clear error
  useEffect(() => {
    if (form.isTouched('name')) {
      form.resetTouched()
      const elementsWithClass = document.querySelectorAll(
        '.mantine-InputWrapper-error'
      )

      if (elementsWithClass) {
        const elementForm = Array.from(elementsWithClass).find((element) => {
          return element.innerText === 'The name must have at least 2 letters!'
        })

        if (elementForm) {
          elementForm.classList.add('unmounted')

          setTimeout(() => {
            form.clearFieldError('name')
          }, 200)
        }
      }
    }
  }, [form.isTouched('name')])

  useEffect(() => {
    if (form.isTouched('surname')) {
      form.resetTouched()
      const elementsWithClass = document.querySelectorAll(
        '.mantine-InputWrapper-error'
      )

      if (elementsWithClass) {
        const elementForm = Array.from(elementsWithClass).find((element) => {
          return (
            element.innerText === 'The surname must have at least 2 letters!'
          )
        })

        if (elementForm) {
          elementForm.classList.add('unmounted')

          setTimeout(() => {
            form.clearFieldError('surname')
          }, 200)
        }
      }
    }
  }, [form.isTouched('surname')])

  useEffect(() => {
    if (form.isTouched('email')) {
      form.resetTouched()
      const elementsWithClass = document.querySelectorAll(
        '.mantine-InputWrapper-error'
      )

      if (elementsWithClass) {
        const elementForm = Array.from(elementsWithClass).find((element) => {
          let error = element.innerText

          return (
            error === 'Invalid mail!' ||
            error === 'Invalid mail domain!' ||
            error === 'An account with this e-mail has already been created!' ||
            error ===
              'Recently you have already created an account, wait a while before creating another one'
          )
        })

        if (elementForm) {
          elementForm.classList.add('unmounted')

          setTimeout(() => {
            form.clearFieldError('email')
          }, 200)
        }
      }
    }
  }, [form.isTouched('email')])

  useEffect(() => {
    if (form.isTouched('confirmPassword')) {
      form.resetTouched()
      const elementsWithClass = document.querySelectorAll(
        '.mantine-InputWrapper-error'
      )

      if (elementsWithClass) {
        const elementForm = Array.from(elementsWithClass).find((element) => {
          return element.innerText === 'Passwords do not match!'
        })

        if (elementForm) {
          elementForm.classList.add('unmounted')

          setTimeout(() => {
            form.clearFieldError('confirmPassword')
          }, 200)
        }
      }
    }
  }, [form.isTouched('confirmPassword')])

  function getMessage(error) {
    let out = language.register.errors.registration_error

    switch (error) {
      case 'account-already-exists': {
        out = language.register.errors.account_already_exists
        break
      }
      case 'too-many-requests': {
        out = language.register.errors.too_many_requests
        break
      }
    }

    return out
  }

  useEffect(() => {
    form.clearErrors()

    if (router.query.error) {
      form.setErrors({
        email: getMessage(router.query.error),
      })
    }
  }, [])

  function getButtonWidth() {
    let out = 55

    switch (language.lang) {
      case 'it': {
        out = 65
        break
      }
      case 'fr': {
        out = 70
        break
      }
      case 'en':
      default: {
        out = 55
      }
    }

    return out
  }

  return (
    <Box style={{ marginLeft: '12px' }}>
      <ScrollArea
        className='center-form'
        h={450}
        offsetScrollbars
        scrollHideDelay={100}>
        <form
          onSubmit={form.onSubmit(async (fields) => {
            setIsLoading(true)

            // create user
            let newUser = {
              name: fields.name,
              email: fields.email,
              surname: fields.surname,
              password: fields.password,
              creationDate: new Date(),
            }

            await axios({
              url: '/api/user',
              method: 'post',
              data: newUser,
            })
              .then(async (res) => {
                if (res.status === 200) {
                  signIn('credentials', {
                    email: fields.email,
                    password: fields.password,
                    redirect: true,
                    callbackUrl: '/',
                  })
                }
              })
              .catch((error) => {
                if (error.response.data.redirect) {
                  router.push(error.response.data.redirect)

                  if (router.query.error) {
                    form.setErrors({
                      email: getMessage(router.query.error),
                    })
                  }
                }
                console.error('Error during API call:', error.message)
              })
          })}>
          <TextInput
            label={language.register.name}
            placeholder={language.register.name}
            radius='xl'
            className='input-margin-top'
            {...form.getInputProps('name')}
          />
          <TextInput
            label={language.register.surname}
            placeholder={language.register.surname}
            radius='xl'
            className='input-margin-top'
            {...form.getInputProps('surname')}
          />

          <Divider my='sm' style={{ marginTop: '20px' }} />

          <TextInput
            mt='sm'
            label={language.login.mail}
            placeholder={language.login.mail}
            radius='xl'
            className='input-margin-top'
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label={language.login.password}
            placeholder={language.login.password}
            radius='xl'
            className='input-margin-top'
            toggleTabIndex={0}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            mt='sm'
            label={language.register.confirm_password}
            placeholder={language.register.confirm_password}
            toggleTabIndex={0}
            radius='xl'
            className='input-margin-top'
            {...form.getInputProps('confirmPassword')}
          />

          <div className='input-center input-margin-top'>
            <Button radius='xl' type='submit' mt='sm' disabled={isLoading}>
              <div className='input-btn' style={{ width: getButtonWidth() }}>
                {isLoading ? (
                  <Loader size='1rem' color='white' />
                ) : (
                  language.register.signup
                )}
              </div>
            </Button>
          </div>
        </form>
      </ScrollArea>
    </Box>
  )
}

export default Register
