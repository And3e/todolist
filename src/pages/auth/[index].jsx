import React, { useState, useEffect, forwardRef } from 'react'

// store
import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState, languagesOutSelector } from '@/recoil_state'

// providers
import { getProviders } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'

// router
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'

import { useForm } from '@mantine/form'

// tab info's
import Head from 'next/head'

// api calls
import axios from 'axios'

import {
  MantineProvider,
  useMantineTheme,
  Tabs,
  Paper,
  Text,
  AppShell,
  Header,
  Select,
  Switch,
  PasswordInput,
  TextInput,
  Button,
  Box,
  ScrollArea,
  Divider,
  Loader,
} from '@mantine/core'

import { GB, IT, FR } from 'country-flag-icons/react/3x2'
import { IconSun, IconMoonStars } from '@tabler/icons-react'

import './auth.css'

// components
// import Login from './login.page.jsx'
// import Register from './register.page.jsx'

// img
import logo from '@/app/imgs/long/logo-long.svg'

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: '/' } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}

function Providers({ providers, language }) {
  function getProviderProps(name, color) {
    let out = null

    switch (name) {
      case 'GitHub': {
        if (color) {
          out = 'dark'
        } else {
          out = 'https://authjs.dev/img/providers/github.svg'
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
          label={<Text fz='sm'>{language ? language.login.or : 'Or'}</Text>}
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
                  {(language ? language.login.signin_with : 'Sign in with ') +
                    provider.name}
                </div>
              </Button>
            </div>
          )
        })}
      </div>
    )
  }
}

function Login({ providers }) {
  const [isLoading, setIsLoading] = useState(false)

  const [language] = useRecoilState(languagesOutSelector)

  const router = useRouter()

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
    let out = language.login.errors.login_error

    let receivedError = error.split('@')[0]
    let provider = error.split('@')[1]
      ? error.split('@')[1]
      : language.login.errors.google_or_github

    switch (receivedError) {
      case 'invalid-credentials': {
        out = language.login.errors.invalid_credentials
        break
      }
      case 'invalid-provider': {
        out =
          language.login.errors.invalid_provider +
          provider.at(0).toUpperCase() +
          provider.slice(1) +
          language.login.errors.button
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

  function getButtonWidth() {
    let out = 50

    if (language.lang === 'fr') {
      out = 75
    }

    return out
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
            setIsLoading(true)

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
            label={language.login.mail}
            placeholder={language.login.mail}
            className='input-margin-top'
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label={language.login.password}
            radius='xl'
            placeholder={language.login.password}
            className='input-margin-top'
            toggleTabIndex={0}
            {...form.getInputProps('password')}
          />

          <div className='input-center input-margin-top'>
            <Button radius='xl' type='submit' mt='sm' disabled={isLoading}>
              <div className='input-btn' style={{ width: getButtonWidth() }}>
                {isLoading ? (
                  <Loader size='1rem' color='white' />
                ) : (
                  language.login.signin
                )}
              </div>
            </Button>
          </div>
        </form>

        <Providers providers={providers} language={language} />
      </ScrollArea>
    </Box>
  )
}

function Register() {
  const router = useRouter()

  const [language] = useRecoilState(languagesOutSelector)

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

function Auth({ providers }) {
  const [theme, setTheme] = useRecoilState(themeState)
  const [language, setLanguage] = useRecoilState(languagesOutSelector)

  const mantineTheme = useMantineTheme()

  const [accountTitle, setAccountTitle] = useState(language.home.title_signin)
  const router = useRouter()

  useEffect(() => {
    // redirect if not a route
    const tab = router.query.index

    if (tab !== 'signin' && tab !== 'signup') {
      router.push('/404')
    }

    if (tab === 'signup') {
      setAccountTitle(language.home.title_signup)
    }
  }, [])

  const data = [
    {
      value: 'English',
      label: 'English',
      flag: (
        <div className='lang-control'>
          <GB title='English' height='20px' style={{ borderRadius: '5px' }} />
        </div>
      ),
    },
    {
      value: 'Italiano',
      label: 'Italiano',
      flag: (
        <div className='lang-control'>
          <IT title='Italiano' height='20px' style={{ borderRadius: '5px' }} />
        </div>
      ),
    },
    {
      value: 'Français',
      label: 'Français',
      flag: (
        <div className='lang-control'>
          <FR title='Français' height='20px' style={{ borderRadius: '5px' }} />
        </div>
      ),
    },
  ]

  const SelectItem = forwardRef(({ flag, ...others }, ref) => (
    <div ref={ref} {...others} style={{ borderRadius: '20px' }}>
      {flag}
    </div>
  ))

  return (
    <MantineProvider
      theme={{ colorScheme: theme, primaryColor: 'orange' }}
      withGlobalStyles
      withNormalizeCSS>
      <AppShell
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],

            padding: '0px',
          },
        })}
        header={
          <Header
            sx={(theme) => ({
              backgroundColor: 'transparent',
              border: 0,
            })}
            className='header'>
            <Switch
              labelPosition='left'
              value='tema'
              size='md'
              color='gray'
              defaultChecked={theme === 'dark'}
              onChange={(event) => {
                if (event.currentTarget.checked) {
                  setTheme('dark')
                } else {
                  setTheme('light')
                }
              }}
              onLabel={
                <IconMoonStars
                  size='1rem'
                  stroke={2.5}
                  color={mantineTheme.colors.blue[6]}
                />
              }
              offLabel={
                <IconSun
                  size='1rem'
                  stroke={2.5}
                  color={mantineTheme.colors.yellow[7]}
                />
              }
            />
            <Select
              radius='xl'
              w={100}
              itemComponent={SelectItem}
              data={data}
              maxDropdownHeight={200}
              defaultValue='English'
              defaultChecked='English'
              onChange={(flag) => {
                let out = 'en'

                if (flag === 'Italiano') {
                  out = 'it'
                } else if (flag === 'Français') {
                  out = 'fr'
                }

                setLanguage(out)
              }}
            />
          </Header>
        }>
        <div className='account-center'>
          <Head>
            <title>{accountTitle}</title>
          </Head>
          <Paper
            shadow='md'
            radius='xl'
            p='lg'
            withBorder
            className='login-container'>
            <a href='/' style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={logo.src}
                height={60}
                className='d-inline-block align-center'
                alt='TO DO logo long'
                style={{ margin: '20px 0px 25px 0px' }}
              />
            </a>
            <Tabs
              defaultValue={router.query.index}
              radius='md'
              value={router.query.index}
              onTabChange={(route) => {
                router.push(`/auth/${route}`)
              }}
              keepMounted={false}>
              <Tabs.List position='center' grow>
                <Tabs.Tab
                  value='signin'
                  onClick={() => setAccountTitle(language.home.title_signin)}>
                  <Text span fz='sm'>
                    {language.login.signin}
                  </Text>
                </Tabs.Tab>
                <Tabs.Tab
                  value='signup'
                  onClick={() => setAccountTitle(language.home.title_signup)}>
                  <Text span fz='sm'>
                    {language.register.signup}
                  </Text>
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value='signin'>
                <Login providers={providers} />
              </Tabs.Panel>
              <Tabs.Panel value='signup'>
                <Register />
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </div>
      </AppShell>
    </MantineProvider>
  )
}

function Index({ providers }) {
  return (
    <RecoilRoot>
      <Auth providers={providers} />
    </RecoilRoot>
  )
}

export default Index

/*
import React, { useState } from 'react'

// store
import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState } from '@/recoil_state'

// providers
import { getProviders } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'

// router
import { useRouter } from 'next/router'

// tab info's
import { Helmet } from 'react-helmet'

import { MantineProvider, Tabs, Paper, Text } from '@mantine/core'

import './auth.css'

// components
import Login from './login.jsx'
import Register from './register.jsx'

// img
import logo from './../../app/imgs/long/logo-long.svg'

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: '/' } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}

function Auth({ providers }) {
  const [theme, setTheme] = useRecoilState(themeState)
  const [titoloAccount, setTitoloAccount] = useState('Accedi')

  const router = useRouter()

  async function login() {
    //await fetch('/api/auth/signin/:github', { method: 'POST' })
  }

  return (
    <MantineProvider
      theme={{ colorScheme: theme, primaryColor: 'orange' }}
      withGlobalStyles
      withNormalizeCSS>
      <div className='account-center'>
        <Helmet>
          <title>TO DO - {titoloAccount}</title>
        </Helmet>
        <Paper
          shadow='md'
          radius='xl'
          p='lg'
          withBorder
          className='login-container'>
          <a href='/' style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={logo.src}
              height={60}
              className='d-inline-block align-center'
              alt='TO DO logo long'
              style={{ margin: '20px 0px 25px 0px' }}
            />
          </a>
          <Tabs
            defaultValue={router.query.index}
            radius='md'
            value={router.query.activeTab}
            onTabChange={(value) => router.push(`/auth/${value}`)}>
            <Tabs.List position='center' grow>
              <Tabs.Tab
                value='signin'
                onClick={() => setTitoloAccount('Sign In')}>
                <Text span fz='sm'>
                  Sign In
                </Text>
              </Tabs.Tab>
              <Tabs.Tab
                value='signup'
                onClick={() => setTitoloAccount('Sign UP')}>
                <Text span fz='sm'>
                  Sign Up
                </Text>
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value='signin'>
              <Login
                setTitoloAccount={setTitoloAccount}
                providers={providers}
              />
            </Tabs.Panel>
            <Tabs.Panel value='signup'>
              <Register setTitoloAccount={setTitoloAccount} />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </div>
    </MantineProvider>
  )
}

function Index({ providers }) {
  return (
    <RecoilRoot>
      <Auth providers={providers} />
    </RecoilRoot>
  )
}

export default Index

*/
