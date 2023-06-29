import { useState, useEffect } from 'react'

// auth
import { signOut } from 'next-auth/react'

// store
import { useRecoilState } from 'recoil'
import { themeState } from './../../../recoil_state'

import { Menu, ActionIcon, Text, Switch, useMantineTheme } from '@mantine/core'

import {
  PersonCircle,
  PersonFill,
  BoxArrowRight,
  Palette,
} from 'react-bootstrap-icons'
import { IconSun, IconMoonStars } from '@tabler/icons-react'

function UserBtn() {
  const [menuOpened, setMenuOpened] = useState(false)
  const [checked, setChecked] = useState(false)
  const mantineTheme = useMantineTheme()
  const [theme, setTheme] = useRecoilState(themeState)

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
    setChecked(theme === 'dark' ? false : true)
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
        <ActionIcon
          onClick={() => {}}
          variant='light'
          color='orange'
          radius='lg'>
          <PersonFill size='1.125rem' />
        </ActionIcon>
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
        <Menu.Item icon={<PersonCircle size={14} />} sx={btnStyle}>
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
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
              onLabel={
                <IconSun
                  size='1rem'
                  stroke={2.5}
                  color={mantineTheme.colors.yellow[2]}
                />
              }
              offLabel={
                <IconMoonStars
                  size='1rem'
                  stroke={2.5}
                  color={mantineTheme.colors.blue[6]}
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
