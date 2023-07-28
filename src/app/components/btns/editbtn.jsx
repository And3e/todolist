import { ActionIcon } from '@mantine/core'
import { PencilSquare, Check } from 'react-bootstrap-icons'

export default function EditBtn({ isEditing, setIsEditing, handleEdit }) {
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
