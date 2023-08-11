// store
import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState } from '@/recoil_state'

import { useRouter } from 'next/navigation'

import Head from 'next/head'

import { MantineProvider, Title, Text, Button, Group } from '@mantine/core'

import { BoxArrowUpRight } from 'react-bootstrap-icons'

import './auth.css'

const classes = {
  imageContainer: 'error-image-container',
  image: 'error-image',
  inner: 'error-inner',
  overlay: 'error-overlay',
  content: 'error-content',
  title: 'error-title',
  code: 'error-code',
  description: 'error-description',
  link: 'error-link',
}

function Illustration({ code }) {
  const [theme, setTheme] = useRecoilState(themeState)

  function handleStyleCode() {
    let out = null

    switch (code) {
      case 200: {
        out = 'min(80vh, 40vw)'
        break
      }
      default: {
        out = 'min(90vh, 50vw)'
      }
    }

    return out
  }

  function handleTextCode() {
    let out = null

    switch (code) {
      case 200:
      case null: {
        out = 'Error'
        break
      }
      default: {
        out = code
      }
    }

    return out
  }

  return (
    <div className={classes.imageContainer}>
      <h1
        className={classes.image}
        style={{
          fontSize: handleStyleCode(),
          color: theme === 'dark' ? 'rgb(193, 194, 197)' : 'black',
          opacity: theme === 'dark' ? 0.03 : 0.1,
        }}>
        {handleTextCode()}
      </h1>
    </div>
  )
}

export function Error({ statusCode }) {
  const [theme, setTheme] = useRecoilState(themeState)
  const { push } = useRouter()

  function handleCode() {
    let out = null

    switch (statusCode) {
      case null: {
        out = 'Client Error'
        break
      }
      case 200: {
        out = 'Server Error'
        break
      }
      default: {
        out = 'Error ' + statusCode
      }
    }

    return out
  }

  function handleTitle() {
    let out = null

    switch (statusCode) {
      case null: {
        out = 'An error occurred on client'
        break
      }
      case 200: {
        out = 'An error occurred on server'
        break
      }
      case 503: {
        out = 'All of our servers are busy'
        break
      }
      default: {
        out = 'An error ' + statusCode + ' occurred on server'
      }
    }

    return out
  }

  return (
    <MantineProvider
      theme={{ colorScheme: theme, primaryColor: 'orange' }}
      withGlobalStyles
      withNormalizeCSS>
      <Head>
        <title>TO DO - Error!</title>
      </Head>
      <Illustration code={statusCode} />
      <div className={classes.overlay}>
        <div className={classes.content} style={{ gap: '30px' }}>
          <div>
            <Text
              color='dimmed'
              size='lg'
              align='center'
              className={classes.code}
              style={{
                color: theme === 'dark' ? '#fff' : 'black',
              }}>
              {handleCode()}
            </Text>
            <Title className={classes.title} order={2}>
              {handleTitle()}
            </Title>

            {statusCode !== 200 && (
              <a
                href={`https://http.cat/status/${statusCode}`}
                target='_blank'
                rel='noopener noreferrer'>
                <Text
                  color='dimmed'
                  size='lg'
                  align='center'
                  className={`${classes.description} ${classes.link}`}
                  style={{
                    fontSize: '15px',
                    margin: 0,
                    color: theme === 'dark' ? '#fff' : 'black',
                  }}>
                  Learn more about {statusCode} error
                  <BoxArrowUpRight />
                </Text>
              </a>
            )}
          </div>
          <Group position='center'>
            <Button
              onClick={() => {
                push('/')
              }}
              size='md'
              radius='xl'>
              Take me back to home page
            </Button>
          </Group>
        </div>
      </div>
    </MantineProvider>
  )
}

function Index({ statusCode }) {
  return (
    <RecoilRoot>
      <Error statusCode={statusCode} />
    </RecoilRoot>
  )
}

Index.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Index
