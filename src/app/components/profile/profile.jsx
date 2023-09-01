import { useState, useEffect, useRef } from 'react'

// store
import { useRecoilState } from 'recoil'
import { userState, languagesInSelector } from '@/recoil_state'

// api calls
import axios from 'axios'

import { Modal, ScrollArea, Text, Divider, Tabs } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import { PersonFill, PaletteFill, LockFill } from 'react-bootstrap-icons'

// account
import Account from './account'
import DangerZone from './dangerzone'

// security
import Security from './security'

// settings
import Appearence from './appearence'

function Profile({ opened, close }) {
  const [user, setUser] = useRecoilState(userState)

  const [language] = useRecoilState(languagesInSelector)

  const viewport = useRef(null)
  const isMobile = useMediaQuery('(max-width: 600px)')

  const [width, setWidth] = useState(window.innerWidth)

  const scrollAreaHeight = '80vh'
  const responsiveBorder = 600
  const modalStyle = {
    paddingTop: width < responsiveBorder ? '10px' : '0px',
  }
  const modalBodyStyle = {
    paddingLeft: width < responsiveBorder ? '0px' : '20px',
  }

  useEffect(() => {
    async function assignUser() {
      const fetchData = await axios('/api/user').catch((error) => {
        console.error(error)
      })

      if (fetchData) {
        setUser(await fetchData.data)
      }
    }

    assignUser()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (typeof isMobile !== 'undefined') {
      let slideEmail = isMobile ? 50 : 25

      document.documentElement.style.setProperty('--slem', `${slideEmail}px`)
    }
  }, [isMobile])

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz='lg' fw={700}>
          {language.user_btn.profile}
        </Text>
      }
      radius='lg'
      size='90%'
      h='fit-content'
      fullScreen={isMobile}
      centered>
      <Tabs
        radius='md'
        variant='pills'
        orientation={width < responsiveBorder ? null : 'vertical'}
        defaultValue='account'>
        <Tabs.List
          w={width < responsiveBorder ? '100%' : '20%'}
          position={width < responsiveBorder ? 'center' : ''}>
          <Tabs.Tab value='account' icon={<PersonFill size='0.8rem' />}>
            {language.account.account}
          </Tabs.Tab>
          <Tabs.Tab value='security' icon={<LockFill size='0.8rem' />}>
            {language.security.security}
          </Tabs.Tab>
          <Tabs.Tab value='appearence' icon={<PaletteFill size='0.8rem' />}>
            {language.account.account}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='account' pl='xs' style={modalStyle}>
          <ScrollArea
            className='center-form'
            h={scrollAreaHeight}
            viewportRef={viewport}
            offsetScrollbars
            scrollHideDelay={100}>
            <div
              className='modal-container'
              style={(modalStyle, modalBodyStyle)}>
              <Account user={user} />
              <Divider
                style={{ margin: '30px 0px 30px 0px' }}
                my='xs'
                label={language.account.danger_zone.danger_zone}
                color='red'
                labelPosition='center'
              />
              <DangerZone viewport={viewport ? viewport : null} />
            </div>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value='security' pl='xs' style={modalStyle}>
          <ScrollArea
            className='center-form'
            h={scrollAreaHeight}
            offsetScrollbars
            scrollHideDelay={100}>
            <div
              className='modal-container'
              style={(modalStyle, modalBodyStyle)}>
              <Security />
            </div>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value='appearence' pl='xs' style={modalStyle}>
          <ScrollArea
            className='center-form'
            h={scrollAreaHeight}
            offsetScrollbars
            scrollHideDelay={100}>
            <div
              className='modal-container'
              style={(modalStyle, modalBodyStyle)}>
              <Appearence />
            </div>
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  )
}

export default Profile
