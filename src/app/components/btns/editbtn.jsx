import { ActionIcon } from '@mantine/core'
import { PencilSquare, Check } from 'react-bootstrap-icons'

import { useRecoilState } from 'recoil'
import { taskState } from '../../../recoil_state'

export default function EditBtn({
  element,
  isEditing,
  setIsEditing,
  inputValue,
  editTask,
  handleEdit,
}) {
  const [tasks, setTasks] = useRecoilState(taskState)

  if (isEditing) {
    return (
      <ActionIcon
        onClick={() => handleEdit()}
        variant='filled'
        color='green'
        radius='lg'>
        <Check size='1.5rem' />
      </ActionIcon>
    )
  } else {
    return (
      <ActionIcon
        onClick={() => {
          setIsEditing(true)
        }}
        variant='filled'
        color='blue'
        radius='md'
        size={26}>
        <PencilSquare size='1rem' />
      </ActionIcon>
    )
  }
}
