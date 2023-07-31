import { useState, useEffect } from 'react'

// auth
import { signOut } from 'next-auth/react'

// store
import { useRecoilState } from 'recoil'
import { themeState, userState } from '@/recoil_state'

import { Menu, Avatar, Text, Switch, useMantineTheme } from '@mantine/core'

import {
  PersonCircle,
  PersonFill,
  BoxArrowRight,
  Palette,
} from 'react-bootstrap-icons'
import { IconSun, IconMoonStars } from '@tabler/icons-react'

function UserBtn({ open }) {
  const [menuOpened, setMenuOpened] = useState(false)
  const [checked, setChecked] = useState(false)
  const [avatar, setAvatar] = useState(
    <Avatar color='gray' size='md' radius='xl'>
      <PersonFill size='1.3em' />
    </Avatar>
  )

  // theme
  const mantineTheme = useMantineTheme()
  const [theme, setTheme] = useRecoilState(themeState)
  const [user, setUser] = useRecoilState(userState)

  // session
  useEffect(() => {
    if (user) {
      let image = user.image

      if (image.at(0) === '$') {
        image = image.slice(1)

        let color = image.split('#')[0]
        let text = image.split('#')[1]

        setAvatar(
          <Avatar
            src={null}
            color={color}
            alt={text}
            size='md'
            radius='xl'
            variant='filled'
            style={{ letterSpacing: '0.8px' }}>
            {text}
          </Avatar>
        )
      } else {
        setAvatar(<Avatar src={image} size='md' radius='xl' />)
      }
    } else {
      setAvatar(
        <Avatar color='orange' size='md' radius='xl'>
          <PersonFill size='1.3em' />
        </Avatar>
      )
    }
  }, [user])

  const btnStyle = (theme) => ({
    borderRadius: '20px',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? 'rgb(69, 50, 24)' : 'rgb(255, 244, 230)',
    },
  })

  function handleClick(event) {
    if (event.target.id != '') {
      setMenuOpened(true)
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  }

  useEffect(() => {
    setChecked(theme === 'dark' ? true : false)
  }, [theme])

  return (
    <Menu
      shadow='md'
      width={200}
      radius='lg'
      transitionProps={{ transition: 'scale-y', duration: 200 }}
      opened={menuOpened}
      onChange={setMenuOpened}>
      <Menu.Target>
        <div className='avatar'>
          {/* FARE FETCH DELLA SRC IMAGE PER FOTO PROFILO */}
          {/* ALTRIMENTI METTERE INIZIALI NOME */}

          {/* attenzione ai nomi composti */}
          {/* NC = nome e cognome */}
          {avatar}
        </div>
      </Menu.Target>

      <Menu.Dropdown onClick={(event) => handleClick(event)}>
        <Menu.Label>
          <Text fz='sm'>Account</Text>
        </Menu.Label>
        <Menu.Item
          icon={<BoxArrowRight size={14} />}
          sx={btnStyle}
          variant='light'
          onClick={() => signOut()}>
          Sign Out
        </Menu.Item>
        <Menu.Item
          icon={<PersonCircle size={14} />}
          sx={btnStyle}
          onClick={open}>
          Profile
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>
          <Text fz='sm'>Look & Feel</Text>
        </Menu.Label>
        <Menu.Item
          icon={<Palette id='#icon-element#' size={14} />}
          sx={btnStyle}
          id='#switch-theme-item#'
          rightSection={
            <Switch
              labelPosition='left'
              value='tema'
              size='md'
              color='gray'
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
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
          }>
          <Text id='#text-element#'>Theme</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default UserBtn
