import React, { useState } from 'react'

import { signOut } from 'next-auth/react'

// api calls
import axios from 'axios'

// store
import { useRecoilState } from 'recoil'
import { languagesInSelector } from '@/recoil_state'

import { PasswordInput, Text, Button, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'

import { ExclamationTriangleFill } from 'react-bootstrap-icons'

function Security() {
  const [isLoading, setIsLoading] = useState(false)

  const [language] = useRecoilState(languagesInSelector)

  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },

    validate: {
      confirmPassword: (value, values) =>
        value !== values.newPassword
          ? language.security.errors.passwords_do_not_match
          : null,
    },
  })

  function getButtonWidth() {
    let out = 60

    switch (language.lang) {
      case 'en': {
        out = 60
        break
      }
    }

    return out
  }

  return (
    <div>
      <div className='profile-title'>
        <h2>{language.security.change_password}</h2>
        <div className='security-alert'>
          <ExclamationTriangleFill color='#ff8c00' />
          <Text fz='sm'>
            {language.account.warnings.change_involves_logging_out}
          </Text>
        </div>
      </div>
      <form
        className='security-container'
        onSubmit={form.onSubmit(async (values) => {
          form.setFieldError('currentPassword', '')

          setIsLoading(true)

          await axios({
            url: '/api/user/password',
            method: 'patch',
            data: {
              oldPswd: values.currentPassword,
              newPswd: values.newPassword,
            },
          })
            .then((res) => {
              if (res.status === 200) {
                signOut()
              } else if (res.status === 403) {
                form.setFieldError(
                  'currentPassword',
                  language.security.errors.old_passwords_do_not_match
                )
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })}>
        <PasswordInput
          className='security-input'
          label='Current Password'
          radius='xl'
          toggleTabIndex={0}
          {...form.getInputProps('currentPassword')}
        />
        <PasswordInput
          className='security-input'
          label='New Password'
          radius='xl'
          toggleTabIndex={0}
          {...form.getInputProps('newPassword')}
        />
        <PasswordInput
          className='security-input'
          label='Confirm Password'
          radius='xl'
          toggleTabIndex={0}
          {...form.getInputProps('confirmPassword')}
        />
        <Button
          className='security-btn'
          variant='filled'
          radius='xl'
          type='submit'
          disabled={isLoading}>
          <div className='input-btn' style={{ width: getButtonWidth() }}>
            {isLoading ? (
              <Loader color='blue' size={20} />
            ) : (
              language.security.confirm
            )}
          </div>
        </Button>
      </form>
    </div>
  )
}

export default Security
