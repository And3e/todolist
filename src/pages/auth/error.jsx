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

  return (
    <div className={classes.imageContainer}>
      <h1
        className={classes.image}
        style={{
          fontSize: code
            ? code === 200
              ? 'min(80vh, 40vw)'
              : 'min(90vh, 50vw)'
            : 'min(90vh, 50vw)',
          color: theme === 'dark' ? 'rgb(193, 194, 197)' : 'black',
          opacity: theme === 'dark' ? 0.03 : 0.1,
        }}>
        {code ? (code === 200 ? 'Error' : code) : 'Error'}
      </h1>
    </div>
  )
}

export function Error({ statusCode }) {
  const [theme, setTheme] = useRecoilState(themeState)
  const { push } = useRouter()

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
              {statusCode ? (statusCode === 200 ? 'Server ' : '') : 'Client '}
              Error
              {statusCode ? (statusCode === 200 ? '' : ` ${statusCode}`) : ''}
            </Text>
            <Title className={classes.title} order={2}>
              {statusCode
                ? statusCode === 200
                  ? 'An error occurred on server'
                  : `An error ${statusCode} occurred on server`
                : 'An error occurred on client'}
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
