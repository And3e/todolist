import { useState, useEffect } from 'react'

import { signOut } from 'next-auth/react'

// store
import { useRecoilState } from 'recoil'
import { userState, languagesInSelector } from '@/recoil_state'

// api calls
import axios from 'axios'

import {
  Avatar,
  Indicator,
  Box,
  TextInput,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'

import { ExclamationTriangleFill } from 'react-bootstrap-icons'

import EditBtn from '../btns/editbtn'

// globals
const animationDuration = 400

function Field({ content, element }) {
  const [user, setUser] = useRecoilState(userState)

  const [language] = useRecoilState(languagesInSelector)

  const [isEditing, setIsEditing] = useState(false)
  const [fieldValue, setFieldValue] = useState(element ? element : '')
  const [error, setError] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFieldValue(element ? element : '')
  }, [element])

  function getElement() {
    const fields = ['Name', 'Surname', 'Email']
    let out = {}

    const uppercaseContent = content.charAt(0).toUpperCase() + content.slice(1)

    if (fields.includes(uppercaseContent)) {
      out[content] = fieldValue
    }

    return out
  }

  function getLabel() {
    let out = 'Unknown'

    switch (content) {
      case 'name': {
        out = language.account.name
        break
      }
      case 'surname': {
        out = language.account.surname
        break
      }
      case 'email': {
        out = 'Email'
        break
      }
    }

    return out
  }

  // function getElement() {
  //   let out = {}

  //   switch (content) {
  //     case 'name': {
  //       out = {
  //         name: fieldValue,
  //       }
  //       break
  //     }
  //     case 'surname': {
  //       out = {
  //         surname: fieldValue,
  //       }
  //       break
  //     }
  //   }

  //   return out
  // }

  // function getLabel() {
  //   let out = 'Unknown'

  //   switch (content) {
  //     case 'name': {
  //       out = 'Name'
  //       break
  //     }
  //     case 'surname': {
  //       out = 'Surname'
  //       break
  //     }
  //   }

  //   return out
  // }

  // api requests

  async function editUser() {
    // edit task => edit content
    let outElement = getElement()

    if (user) {
      outElement.id = user.id

      setIsLoading(true)

      // console.log('outElement', outElement)

      await axios({
        url: '/api/user',
        method: 'patch',
        data: outElement,
      })
        .then((res) => {
          if (res.status === 409) {
            setError('Account already exists')
          } else if (content === 'email') {
            signOut()
          }
        })
        .catch((error) => {
          console.log(error)
        })

      // update user
      const fetchData = await axios('/api/user').catch((error) => {
        console.log(error)
      })

      if (fetchData) {
        setUser(await fetchData.data)
      }

      setIsLoading(false)
    }
  }

  function handleEdit() {
    if (fieldValue != element && fieldValue.length > 2) {
      editUser()
    }
    setIsEditing(false)
  }

  // check provenienza click (btns || parent element)
  function handleClick(event) {
    if (event.target.id != '' && !isEditing) {
      handleEdit()
    }
  }

  // style
  const theme = useMantineTheme()

  function getStyle(theme) {
    return {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      borderRadius: theme.radius.xl,
      height: '40px',
    }
  }

  return (
    <div
      style={{
        transition: `all ${animationDuration}ms ease-in-out`,
      }}>
      <label
        className='mantine-InputWrapper-label mantine-Select-label modal-label'
        style={{
          color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#212529',
        }}>
        {getLabel()}
      </label>
      <Box
        className='element edit-field-container'
        id='element'
        sx={(theme) => getStyle(theme)}
        onClick={handleClick}>
        {isEditing ? (
          <Box className='icon-element-conainter' id='text-input'>
            <TextInput
              placeholder={element ? '' : 'Unknown'}
              size='xs'
              disabled={user ? false : true}
              variant='unstyled'
              radius='md'
              className={`edit-field ${error === '' ? '' : 'error'}`}
              value={fieldValue}
              onChange={(event) => {
                setFieldValue(event.currentTarget.value)
                setError('')
              }}
              onKeyDown={getHotkeyHandler([['Enter', () => handleEdit()]])}
            />
          </Box>
        ) : (
          <Box className='icon-element-conainter' id='text'>
            <Text className={`edit-field ${error === '' ? '' : 'error'}`}>
              {element ? fieldValue : 'Unknown'}
            </Text>
          </Box>
        )}
        <div className='btns-container'>
          <EditBtn
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleEdit={handleEdit}
            isLoading={isLoading}
          />
        </div>
      </Box>
      {content === 'email' && error === '' ? (
        <div className={`email-alert ${isEditing ? 'visible' : 'hidden'}`}>
          <ExclamationTriangleFill color='#ff8c00' />
          <Text fz='sm'>
            {language.account.warnings.change_involves_logging_out}
          </Text>
        </div>
      ) : (
        <Text fz='sm' color='red' style={{ marginLeft: '10px' }}>
          {error}
        </Text>
      )}
    </div>
  )
}

function Account() {
  const [user] = useRecoilState(userState)
  const [avatar, setAvatar] = useState(<Avatar radius='xl' size='lg' />)

  const [language] = useRecoilState(languagesInSelector)

  // avatar
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
            size='lg'
            variant='filled'
            style={{ letterSpacing: '0.8px' }}>
            {text}
          </Avatar>
        )
      } else {
        setAvatar(<Avatar src={image} radius='xl' size='lg' />)
      }
    } else {
      setAvatar(<Avatar radius='xl' size='lg' />)
    }
  }, [user])

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[2],
        padding: theme.spacing.xl,
        borderRadius: theme.radius.lg,
      })}>
      <div className='account-header'>
        <div className='modal-avatar-conatiner'>
          <Indicator
            position='bottom-center'
            color='blue'
            size={15}
            withBorder
            processing>
            {avatar}
          </Indicator>
          <h2 style={{ wordBreak: 'break-all' }}>
            {language.account.hi + (user ? ' ' + user.name : '') + '!'}
          </h2>
        </div>
      </div>
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
          padding: theme.spacing.xl,
          borderRadius: theme.radius.lg,
          marginTop: '15px',
        })}>
        <div className='element-container'>
          <Field content='name' element={user ? user.name : null} />
          <Field content='surname' element={user ? user.surname : null} />
          <Field content='email' element={user ? user.email : null} />
        </div>
      </Box>
    </Box>
  )
}

export default Account
