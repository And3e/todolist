// store
import { RecoilRoot, useRecoilState } from 'recoil'
import { themeState, languagesOutSelector } from '@/recoil_state'

import { useRouter } from 'next/navigation'

import Head from 'next/head'

import { MantineProvider, Title, Text, Button, Group } from '@mantine/core'

import './../error.css'

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
  const [theme] = useRecoilState(themeState)

  return (
    <div className={classes.imageContainer}>
      <h1
        className={classes.image}
        style={{
          color: theme === 'dark' ? 'rgb(193, 194, 197)' : 'black',
          opacity: theme === 'dark' ? 0.03 : 0.1,
        }}>
        404
      </h1>
    </div>
  )
}

export function Content404() {
  const [theme] = useRecoilState(themeState)
  const { push } = useRouter()

  const [language] = useRecoilState(languagesOutSelector)

  return (
    <MantineProvider
      theme={{ colorScheme: theme, primaryColor: 'orange' }}
      withGlobalStyles
      withNormalizeCSS>
      <Head>
        <title>{language._error.to_do_error}</title>
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
              {language.error_404.error_404}
            </Text>
            <Title className={classes.title}>
              {language.error_404.nothing_to_see_here}
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
            <span>{language.error_404.page_do_not_exists}</span>
          </Text>
          <Group position='center'>
            <Button
              onClick={() => {
                push('/')
              }}
              size='md'
              radius='xl'>
              {language._error.back_home}
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
