import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState } from '@/recoil_state'

import { useRouter } from 'next/navigation'

import Head from 'next/head'

import { MantineProvider, Title, Text, Button, Group } from '@mantine/core'

import './../auth/auth.css'

const classes = {
  imageContainer: 'error-image-container',
  image: 'error-image',
  inner: 'error-inner',
  overlay: 'error-overlay',
  content: 'error-content',
  title: 'error-title',
  code: 'error-code',
  description: 'error-description',
}

function Illustration() {
  const [theme, setTheme] = useRecoilState(themeState)

  return (
    <div className={classes.imageContainer}>
      <h1
        className={classes.image}
        style={{
          color: theme === 'dark' ? 'rgb(193, 194, 197)' : 'black',
          opacity: theme === 'dark' ? 0.03 : 0.1,
        }}>
        500
      </h1>
    </div>
  )
}

export function Content404() {
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
      <Illustration />
      <div className={classes.overlay}>
        <div className={classes.content}>
          <div>
            <Text
              color='dimmed'
              size='lg'
              align='center'
              className={classes.code}
              style={{
                color: theme === 'dark' ? '#fff' : 'black',
              }}>
              Error 500
            </Text>
            <Title className={classes.title}>
              Something bad just happened...
            </Title>
          </div>
          <Text
            color='dimmed'
            size='lg'
            align='center'
            className={classes.description}
            style={{
              color: theme === 'dark' ? '#fff' : 'black',
            }}>
            <span>
              Our servers could not handle your request. Don't worry, our
              development team was already notified. Try refreshing the page.
            </span>
          </Text>
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

export default function Page404() {
  return (
    <RecoilRoot>
      <Content404 />
    </RecoilRoot>
  )
}
