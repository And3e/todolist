import { useState } from 'react'

import { signOut } from 'next-auth/react'

// api calls
import axios from 'axios'

import { Box, Button, Text } from '@mantine/core'

function DangerZone({ viewport }) {
  const [opened, setOpened] = useState(false)

  function hexToRgbA(hex, alpha = 1) {
    // Check if the hex value starts with '#', and remove it if present
    if (hex.startsWith('#')) {
      hex = hex.slice(1)
    }

    // Check if the hex value is shorthand (e.g., #ABC) and expand it to full format (e.g., #AABBCC)
    if (hex.length === 3) {
      hex = hex.replace(/(.)/g, '$1$1')
    }

    // Convert the hex values to decimal
    const red = parseInt(hex.substring(0, 2), 16)
    const green = parseInt(hex.substring(2, 4), 16)
    const blue = parseInt(hex.substring(4, 6), 16)

    // Validate alpha value to be within the range [0, 1]
    const validAlpha = Math.min(Math.max(alpha, 0), 1)

    // Return the RGBA string
    return `rgba(${red}, ${green}, ${blue}, ${validAlpha})`
  }

  return (
    <div>
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? hexToRgbA(theme.colors.red[9], 0.5)
              : hexToRgbA(theme.colors.red[5], 0.8),
          padding: theme.spacing.xl,
          borderRadius: theme.radius.lg,
        })}>
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark'
                ? hexToRgbA(theme.colors.red[7], 0.2)
                : hexToRgbA(theme.colors.red[7], 0.5),
            padding: theme.spacing.xl,
            borderRadius: theme.radius.lg,
            marginTop: '15px',
          })}>
          <div className='element-container'>
            <Button
              onClick={() => {
                setOpened(!opened)

                if (!opened) {
                  setTimeout(() => {
                    viewport.current.scrollTo({
                      top: 300,
                      behavior: 'smooth',
                    })
                  }, 400)
                }
              }}
              color='red'
              radius='xl'
              variant='outline'
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? null : theme.colors.red[7],
                color: 'white',
                borderColor: 'red',

                '&:hover': {
                  backgroundColor: 'red',
                },
              })}>
              Delete account
            </Button>
          </div>
        </Box>
        <div className={`confirm-delete ${opened ? 'visible' : 'hidden'}`}>
          <Text fs='md' fw={700} c='white' ta='center'>
            Are you sure you want to delete your account?
          </Text>
          <Text c='white' ta='center'>
            The operation is not reversible
          </Text>
          <Button
            onClick={async () => {
              await axios({
                url: '/api/user/',
                method: 'delete',
              }).catch((error) => {
                console.log(error)
              })

              await signOut()
            }}
            color='red'
            radius='xl'
            style={{ marginTop: '10px' }}
            w='fit-content'
            sx={(theme) => ({
              backgroundColor: 'red',

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? 'rgba(255, 0, 0, 0.8)'
                    : 'rgba(255, 0, 0, 0.6)',
              },
            })}>
            Delete
          </Button>
        </div>
      </Box>
    </div>
  )
}

export default DangerZone
