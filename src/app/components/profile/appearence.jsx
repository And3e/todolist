import { useState, useEffect, forwardRef } from 'react'

// store
import { useRecoilState } from 'recoil'
import { themeState, userState, languagesInSelector } from '@/recoil_state'

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
  Loader,
  SegmentedControl,
} from '@mantine/core'

import { IconSun, IconMoonStars } from '@tabler/icons-react'
import { GB, IT, FR } from 'country-flag-icons/react/1x1'

function Appearence() {
  const mantineTheme = useMantineTheme()
  const [theme, setTheme] = useRecoilState(themeState)
  const [user, setUser] = useRecoilState(userState)

  const [language] = useRecoilState(languagesInSelector)

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

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTheme, setIsLoadingTheme] = useState(false)

  // colors
  const colorList = language.appearence.user_icon.custom.colors
  const colors = [
    {
      value: 'red',
      label: colorList.red,
    },
    {
      value: 'pink',
      label: colorList.pink,
    },
    {
      value: 'grape',
      label: colorList.grape,
    },
    {
      value: 'violet',
      label: colorList.violet,
    },
    {
      value: 'indigo',
      label: colorList.indigo,
    },
    {
      value: 'blue',
      label: colorList.blue,
    },
    {
      value: 'cyan',
      label: colorList.cyan,
    },
    {
      value: 'teal',
      label: colorList.teal,
    },
    {
      value: 'green',
      label: colorList.green,
    },
    {
      value: 'lime',
      label: colorList.lime,
    },
    {
      value: 'yellow',
      label: colorList.yellow,
    },
    {
      value: 'orange',
      label: colorList.orange,
    },
  ]

  // Avatar
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
            color={isLoading ? 'orange' : color}
            alt={text}
            radius='xl'
            size='xl'
            variant='filled'
            style={{ letterSpacing: '0.8px' }}>
            {isLoading ? <Loader size='3rem' color='white' /> : text}
          </Avatar>
        )
      } else {
        if (isLoading) {
          setAvatar(
            <Avatar
              src={null}
              color='orange'
              alt='Loading Icon'
              radius='xl'
              size='xl'
              variant='filled'
              style={{ letterSpacing: '0.8px' }}>
              <Loader size='3rem' color='white' />
            </Avatar>
          )
        } else {
          if (isLoading) {
            setAvatar(
              <Avatar
                src={null}
                color='orange'
                alt='Loading Icon'
                radius='xl'
                size='xl'
                variant='filled'
                style={{ letterSpacing: '0.8px' }}>
                <Loader size='3rem' color='white' />
              </Avatar>
            )
          } else {
            setAvatar(<Avatar src={image} radius='xl' size='xl' />)
          }
        }
      }
    } else {
      setAvatar(<Avatar radius='xl' size='xl' />)
    }
  }, [user, isLoading])

  // colorScheme
  async function syncTheme(colorScheme) {
    let outElement = {
      colorScheme: colorScheme,
    }

    if (user) {
      setIsLoadingTheme(true)

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

      setIsLoadingTheme(false)
    }
  }

  // color picker
  const SelectItem = forwardRef(({ value, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group
        noWrap
        style={{ marginTop: '5px', marginBottom: '5px' }}
        key={value}>
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

  // image
  async function updateImage(image) {
    setIsLoading(true)

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

    setIsLoading(false)
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

  useEffect(customImage, [color, character])

  useEffect(() => {
    if (link !== '' && link !== user.image) {
      updateImage(link)
    } else if (link === '') {
      customImage()
    }
  }, [link])

  // change language
  function handleLanguage(lang) {}

  function getLanguageColorScheme(colorScheme) {
    let out = language.appearence.website_theme.dark_default
    if (user) {
      if (colorScheme === 'dark') {
        out = language.appearence.website_theme.dark
      } else {
        out = language.appearence.website_theme.light
      }
    }

    return out
  }

  return (
    <div>
      <h2 className='profile-title'>{language.appearence.appearence}</h2>
      <Divider
        style={{ margin: '30px 0px 30px 0px' }}
        my='xs'
        label={language.appearence.website_theme.website_theme}
        labelPosition='center'
      />
      <div className='pref-theme-container'>
        <span className='pref-theme-label'>
          <Text>{language.appearence.website_theme.preferred_theme}</Text>
          <Badge
            variant='dot'
            color={
              user ? (user.colorScheme === 'dark' ? 'violet' : 'yellow') : null
            }>
            <div className='pref-theme-label'>
              {getLanguageColorScheme(user.colorScheme)}
              {isLoadingTheme ? (
                <Loader
                  size='0.7rem'
                  color={user.colorScheme === 'dark' ? 'dark' : 'white'}
                />
              ) : null}
            </div>
          </Badge>
        </span>
        <Switch
          labelPosition='left'
          value='tema'
          size='md'
          color='gray'
          disabled={isLoadingTheme}
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
        label={language.appearence.language}
        labelPosition='center'
      />
      <SegmentedControl
        fullWidth
        color='orange'
        radius='xl'
        onChange={(lang) => handleLanguage(lang)}
        data={[
          {
            label: (
              <div className='lang-control'>
                <GB
                  title='English'
                  height='25px'
                  style={{ borderRadius: '25px' }}
                />
              </div>
            ),
            value: 'en',
          },
          {
            label: (
              <div className='lang-control'>
                <IT
                  title='Italiano'
                  height='25px'
                  style={{ borderRadius: '25px' }}
                />
              </div>
            ),
            value: 'it',
          },
          {
            label: (
              <div className='lang-control'>
                <FR
                  title='Français'
                  height='25px'
                  style={{ borderRadius: '25px' }}
                />
              </div>
            ),
            value: 'fr',
          },
        ]}
      />

      <Divider
        style={{ margin: '30px 0px 30px 0px' }}
        my='xs'
        label={language.appearence.user_icon.user_icon}
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
                {language.appearence.user_icon.custom.letters}
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
              label={language.appearence.user_icon.custom.choosen_color}
              placeholder={language.appearence.user_icon.custom.pick_one}
              itemComponent={SelectItem}
              data={colors}
              searchable
              maxDropdownHeight='30vh'
              radius='xl'
              nothingFound={language.appearence.user_icon.custom.nothing_found}
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
            placeholder={language.appearence.user_icon.image.link_to_my_image}
            label={language.appearence.user_icon.image.image_link}
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
