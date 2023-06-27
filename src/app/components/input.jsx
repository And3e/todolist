import { useState, useEffect } from 'react'

import { Button, TextInput, Flex, Kbd } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'

import { useRecoilState } from 'recoil'
import { taskState } from '../../recoil_state'

export default function Input() {
  const [taskName, setTaskName] = useState('')
  const [tasks, setTasks] = useRecoilState(taskState)

  const [seeKbd, setSeeKbd] = useState(true)

  // API call
  async function addTask() {
    if (taskName.length > 0) {
      // create task
      let outTask = {
        content: taskName,
        done: false,
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
  const rightSection = (
    <Flex align='center'>
      <Kbd mr={5}>Enter</Kbd>
    </Flex>
  )

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
          addTask()
        }}>
        Insert
      </Button>
    </div>
  )
}
