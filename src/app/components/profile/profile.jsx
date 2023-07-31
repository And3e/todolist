import { useState, useEffect, useRef } from 'react'

// store
import { useRecoilState } from 'recoil'
import { userState } from '@/recoil_state'

import { Modal, ScrollArea, Text, Divider, Tabs } from '@mantine/core'

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
  const viewport = useRef(null)

  const [width, setWidth] = useState(window.innerWidth)

  const scrollAreaHeight = '80vh'
  const responsiveBorder = 600
  const modalStyle = {
    paddingTop: width < responsiveBorder ? '10px' : '0px',
  }
  const modalBodyStyle = {
    paddingLeft: width < responsiveBorder ? '0px' : '20px',
  }

  async function assignUser() {
    const fetchData = await fetch('/api/user')

    if (fetchData) {
      setUser(await fetchData.json())
    }
  }

  useEffect(() => {
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

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz='lg' fw={700}>
          Profile
        </Text>
      }
      radius='lg'
      size='90%'
      h='fit-content'
      fullScreen={width < responsiveBorder ? true : false}
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
            Account
          </Tabs.Tab>
          <Tabs.Tab value='security' icon={<LockFill size='0.8rem' />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value='appearence' icon={<PaletteFill size='0.8rem' />}>
            Appearence
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
                label='Danger Zone'
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
