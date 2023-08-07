import { useState, useEffect } from 'react'

// store
import { useRecoilState, useRecoilValue } from 'recoil'
import { taskState, limitTask } from '@/recoil_state'

import { Button, Text, TextInput, Flex, Kbd } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

export default function Input() {
  const [taskName, setTaskName] = useState('')
  const [tasks, setTasks] = useRecoilState(taskState)
  const limitTasks = useRecoilValue(limitTask)

  const [seeKbd, setSeeKbd] = useState(true)

  // API call
  async function addTask() {
    if (taskName.length > 0) {
      const count = tasks.filter((obj) => obj.done === false).length

      // create task
      let outTask = {
        content: taskName,
        done: false,
        dragOrder: count + 1,
      }

      await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(outTask),
      })

      // update list
      const fetchData = await fetch('/api/tasks')

      setTasks(await fetchData.json())

      // update input field
      setTaskName('')
    }
  }

  // Hotkeys icons
  const rightSection =
    window.innerWidth > 600 ? (
      <Flex align='center'>
        <Kbd mr={5}>Enter</Kbd>
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
          Maximum limit of {limitTasks} tasks reached!
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

  return (
    <div className='input-container'>
      <TextInput
        color='orange'
        w='80%'
        placeholder='Add field...'
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
        onClick={() => {
          handleClick()
        }}>
        Insert
      </Button>
    </div>
  )
}
