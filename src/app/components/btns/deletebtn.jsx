import { ActionIcon, Button, Text } from '@mantine/core'
import { Trash3Fill } from 'react-bootstrap-icons'

import { notifications } from '@mantine/notifications'
import { useRecoilState } from 'recoil'
import { taskState } from '../../../recoil_state'

export default function DeleteBtn({ element }) {
  const [tasks, setTasks] = useRecoilState(taskState)

  async function handleAnnulla() {
    // cancel operation => recreate task
    await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(element),
    })

    const fetchData = await fetch('/api/tasks')

    // update list
    setTasks(await fetchData.json())

    notifications.hide(element.id)
  }

  async function deleteTask() {
    // delete
    let outURL = element.id + '/' + element.userId

    await fetch('/api/tasks/' + outURL, {
      method: 'DELETE',
    })

    // update list
    const fetchData = await fetch('/api/tasks')

    setTasks(await fetchData.json())
  }

  function showNotifica() {
    let outText = element.content

    if (outText.length > 17) {
      outText = outText.slice(0, 17)
      outText += '...'
    }

    notifications.show({
      id: element.id,
      autoClose: 4000,
      color: 'green',
      message: (
        <div className='dialog-container'>
          <Text span fz='md'>
            Task <b>{outText}</b> eliminated!
          </Text>
          <Button
            onClick={() => {
              handleAnnulla()
            }}
            style={{ margin: '1px' }}
            color='red'
            variant='outline'
            radius='md'>
            Cancel
          </Button>
        </div>
      ),
    })
  }

  return (
    <ActionIcon
      onClick={() => {
        showNotifica()
        deleteTask()
      }}
      variant='filled'
      color='red'
      radius='md'
      size={26}>
      <Trash3Fill size='1rem' />
    </ActionIcon>
  )
}
