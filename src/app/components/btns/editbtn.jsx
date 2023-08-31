import { ActionIcon, Loader } from '@mantine/core'
import { Check } from 'react-bootstrap-icons'
import { IconPencil } from '@tabler/icons-react'

export default function EditBtn({
  isEditing,
  setIsEditing,
  handleEdit,
  isLoading,
  isDisabled,
}) {
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
        disabled={isLoading || isDisabled}
        color='blue'
        radius='md'
        size={26}>
        {isLoading ? (
          <Loader size='1rem' color='white' />
        ) : (
          <IconPencil size='1rem' />
        )}
      </ActionIcon>
    )
  }
}
