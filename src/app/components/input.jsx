import { useState, useEffect } from 'react'

// api calls
import axios from 'axios'

// store
import { useRecoilState, useRecoilValue } from 'recoil'
import { taskState, limitTask, languagesInSelector } from '@/recoil_state'

import { Button, Text, TextInput, Flex, Kbd, Loader } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

export default function Input() {
  const [taskName, setTaskName] = useState('')
  const [tasks, setTasks] = useRecoilState(taskState)
  const limitTasks = useRecoilValue(limitTask)

  const [seeKbd, setSeeKbd] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [language] = useRecoilState(languagesInSelector)

  // API call
  async function addTask() {
    if (taskName.length > 0) {
      setIsLoading(true)

      const count = tasks.filter((obj) => obj.done === false).length

      // create task
      let outTask = {
        content: taskName.trim(),
        done: false,
        dragOrder: count + 1,
      }

      await axios({
        url: '/api/tasks',
        method: 'post',
        data: outTask,
      }).catch((error) => {
        console.log(error)
      })

      // update list
      const fetchData = await axios('/api/tasks').catch((error) => {
        console.log(error)
      })

      setTasks(fetchData.data)

      // update input field
      setTaskName('')
      setIsLoading(false)
    }
  }

  // Hotkeys icons
  const rightSection =
    window.innerWidth > 600 ? (
      <Flex align='center'>
        <Kbd mr={5}>{language.input.enter}</Kbd>
      </Flex>
    ) : null

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setSeeKbd(width >= 800)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // click inserimento

  function showNotifica(limitTasks) {
    notifications.show({
      autoClose: 4000,
      color: 'yellow',
      message: (
        <Text span fz='md'>
          {language.input.errors.max_limit +
            limitTasks +
            language.input.errors.reached}
        </Text>
      ),
    })
  }

  function handleClick() {
    // update list
    if (tasks.length < limitTasks) {
      addTask()
    } else {
      showNotifica(limitTasks)
    }
  }

  function getButtonWidth() {
    let out = 50

    switch (language.lang) {
      case 'it': {
        out = 65
        break
      }
      case 'fr': {
        out = 60
        break
      }
      case 'en':
      default: {
        out = 50
      }
    }

    return out
  }

  return (
    <div className='input-container'>
      <TextInput
        color='orange'
        w='80%'
        placeholder={language.input.add_field}
        variant='filled'
        radius='xl'
        size='md'
        value={taskName}
        rightSection={seeKbd ? rightSection : null}
        rightSectionWidth={seeKbd ? 80 : null}
        styles={seeKbd ? { rightSection: { pointerEvents: 'none' } } : null}
        onChange={(event) => setTaskName(event.currentTarget.value)}
        onKeyDown={getHotkeyHandler([['Enter', () => addTask()]])}
      />
      <Button
        radius='xl'
        size='md'
        disabled={isLoading}
        onClick={() => {
          handleClick()
        }}>
        <div className='input-btn' style={{ width: getButtonWidth() }}>
          {isLoading ? (
            <Loader color='blue' size={20} />
          ) : (
            language.input.insert
          )}
        </div>
      </Button>
    </div>
  )
}
