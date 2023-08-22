import { signOut } from 'next-auth/react'

// api calls
import axios from 'axios'

import { PasswordInput, Text, Button } from '@mantine/core'
import { useForm } from '@mantine/form'

import { ExclamationTriangleFill } from 'react-bootstrap-icons'

function Security() {
  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },

    validate: {
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Le passwords non corrispondono!' : null,
    },
  })

  return (
    <div>
      <h3 style={{ marginBottom: 0 }}>Change Password</h3>
      <div className='security-alert'>
        <ExclamationTriangleFill color='#ff8c00' />
        <Text fz='sm'>This change involves logging out of the session!</Text>
      </div>
      <form
        className='security-container'
        onSubmit={form.onSubmit(async (values) => {
          form.setFieldError('currentPassword', '')

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
                  'Old passwords do not match'
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
          type='submit'>
          Confirm
        </Button>
      </form>
    </div>
  )
}

export default Security
