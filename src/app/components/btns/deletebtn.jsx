import { ActionIcon, Button, Text } from '@mantine/core'
import { Trash3Fill } from 'react-bootstrap-icons'

// api calls
import axios from 'axios'

import { notifications } from '@mantine/notifications'
import { useRecoilState } from 'recoil'
import { taskState } from '@/recoil_state'

export default function DeleteBtn({ element }) {
  const [tasks, setTasks] = useRecoilState(taskState)

  async function handleAnnulla() {
    // cancel operation => recreate task
    await axios({
      url: '/api/tasks',
      method: 'post',
      data: element,
    }).catch((error) => {
      console.error(error)
    })

    const fetchData = await axios('/api/tasks').catch((error) => {
      console.error(error)
    })

    // update list
    setTasks(await fetchData.data)

    notifications.hide(element.id)
  }

  async function deleteTask() {
    // delete
    let outURL = element.id + '/' + element.userId

    await axios({
      url: '/api/tasks/' + outURL,
      method: 'delete',
    }).catch((error) => {
      console.error(error)
    })

    // update list
    const fetchData = await axios('/api/tasks').catch((error) => {
      console.error(error)
    })

    setTasks(await fetchData.data)
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
