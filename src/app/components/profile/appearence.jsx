import { useState, useEffect, forwardRef } from 'react'

// store
import { useRecoilState } from 'recoil'
import { themeState, userState } from '@/recoil_state'

// api calls
import axios from 'axios'

import {
  Divider,
  Switch,
  useMantineTheme,
  Text,
  Badge,
  Avatar,
  TextInput,
  Group,
  Select,
  Box,
  PinInput,
} from '@mantine/core'

import { IconSun, IconMoonStars } from '@tabler/icons-react'

import colors from './colors'

function Appearence() {
  const mantineTheme = useMantineTheme()
  const [theme, setTheme] = useRecoilState(themeState)
  const [user, setUser] = useRecoilState(userState)

  const [character, setCharacter] = useState(
    user && user.image.at(0) === '$' ? user.image.slice(1).split('#')[1] : ''
  )

  const [avatar, setAvatar] = useState(<Avatar radius='xl' size='lg' />)
  const [color, setColor] = useState(
    user && user.image.at(0) === '$' ? user.image.slice(1).split('#')[0] : ''
  )
  const [link, setLink] = useState(
    user && user.image.at(0) !== '$' ? user.image : ''
  )

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
            radius='xl'
            size='xl'
            variant='filled'
            style={{ letterSpacing: '0.8px' }}>
            {text}
          </Avatar>
        )
      } else {
        setAvatar(<Avatar src={image} radius='xl' size='xl' />)
      }
    } else {
      setAvatar(<Avatar radius='xl' size='xl' />)
    }
  }, [user])

  // colorScheme
  async function syncTheme(colorScheme) {
    let outElement = {
      colorScheme: colorScheme,
    }

    if (user) {
      outElement.id = user.id

      await axios({
        url: '/api/user',
        method: 'patch',
        data: outElement,
      }).catch((error) => {
        console.log(error)
      })

      // update user
      const fetchData = await axios('/api/user').catch((error) => {
        console.log(error)
      })

      if (fetchData) {
        setUser(await fetchData.data)
      }
    }
  }

  // color picker
  const SelectItem = forwardRef(({ value, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group
        noWrap
        style={{ marginTop: '5px', marginBottom: '5px' }}
        key={name}>
        <Box
          sx={() => ({
            backgroundColor: value !== 'grape' ? value : 'rgb(174, 62, 201)',
            borderRadius: '50%',
            height: '18px',
            width: '18px',
          })}
        />

        <div>
          <Text size='sm'>{label}</Text>
        </div>
      </Group>
    </div>
  ))

  async function updateImage(image) {
    await axios({
      url: '/api/user',
      method: 'patch',
      data: {
        image: image,
        id: user.id,
      },
    }).catch((error) => {
      console.error(error)
    })

    // update user
    const fetchData = await axios('/api/user').catch((error) => {
      console.error(error)
    })

    if (fetchData) {
      setUser(await fetchData.data)
    }
  }

  function customImage() {
    if (color !== '') {
      let image = '$' + color + '#'

      if (user) {
        if (character.length > 0) {
          image += character
        } else {
          image += user.name.toUpperCase().charAt(0)
          image += user.surname.toUpperCase().charAt(0)
        }

        if (image !== user.image) {
          updateImage(image)
        }
      }
    }
  }

  useEffect(() => customImage(), [color, character])

  useEffect(() => {
    if (link !== '' && link !== user.image) {
      updateImage(link)
    } else if (link === '') {
      customImage()
    }
  }, [link])

  return (
    <div>
      <h2 className='profile-title'>Appearence</h2>
      <Divider
        style={{ margin: '30px 0px 30px 0px' }}
        my='xs'
        label='Website theme'
        labelPosition='center'
      />
      <div className='pref-theme-container'>
        <span className='pref-theme-label'>
          <Text>Preferred Theme</Text>
          <Badge
            variant='dot'
            color={
              user ? (user.colorScheme === 'dark' ? 'violet' : 'yellow') : null
            }>
            {user ? user.colorScheme : 'dark (default)'}
          </Badge>
        </span>
        <Switch
          labelPosition='left'
          value='tema'
          size='md'
          color='gray'
          styles={{
            track: {
              backgroundColor:
                theme === 'dark'
                  ? null
                  : mantineTheme.colors.gray[3] + ' !important',
              border: theme === 'dark' ? null : 'none',
            },
          }}
          defaultChecked={
            user ? (user.colorScheme === 'dark' ? true : false) : true
          }
          onChange={async (event) => {
            if (event.target.checked) {
              setTheme('dark')
              await syncTheme('dark')
            } else {
              setTheme('light')
              await syncTheme('light')
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
      </div>
      <Divider
        style={{ margin: '30px 0px 30px 0px' }}
        my='xs'
        label='User Icon'
        labelPosition='center'
      />

      <div className='avatar-container'>{avatar}</div>

      <div className='user-icon-container'>
        <div className='user-icon-choise'>
          <div className='personalised-choise-container background-input'>
            <div className='letters-input'>
              <label
                className='mantine-InputWrapper-label mantine-Select-label modal-label'
                style={{
                  color: theme === 'dark' ? '#C1C2C5' : '#212529',
                }}>
                Letters
              </label>
              <PinInput
                length={2}
                radius='md'
                value={character}
                inputType='text'
                type={/^[A-Za-zÀ-ÿ]+$/}
                onChange={(char) => setCharacter(char.toUpperCase())}
              />
            </div>

            <Select
              label='Choose a color'
              placeholder='Pick one'
              itemComponent={SelectItem}
              data={colors}
              searchable
              maxDropdownHeight='30vh'
              radius='xl'
              nothingFound='No color found!'
              filter={(value, item) =>
                item.value.includes(value.toLocaleLowerCase().trim())
              }
              value={color}
              onChange={setColor}
            />
          </div>

          <Divider
            style={{ margin: 0 }}
            my='xs'
            label='or'
            labelPosition='center'
            orientation={
              window && window.innerWidth < 600 ? 'horizontal' : 'vertical'
            }
          />
          <TextInput
            placeholder='https://link-to-my-image.com'
            label='Image Link'
            radius='xl'
            value={link}
            className='background-input'
            onChange={(event) => setLink(event.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default Appearence
