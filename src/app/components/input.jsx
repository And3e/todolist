import { useState } from 'react'

import { Button, TextInput } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'

import { useRecoilState } from 'recoil'
import { taskState } from '../../recoil_state'

export default function Input() {
  const [taskName, setTaskName] = useState('')
  const [tasks, setTasks] = useRecoilState(taskState)

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
