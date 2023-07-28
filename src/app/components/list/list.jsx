import { useState, useEffect } from 'react'

// store
import { useRecoilState } from 'recoil'
import { taskState } from '@/recoil_state'

import { ScrollArea, Box, NavLink, Text } from '@mantine/core'

import DnD from './dnd'

export default function List() {
  const [tasksStore, setTasks] = useRecoilState(taskState)

  const [tasksProgress, setTasksProgress] = useState(null)
  const [tasksDone, setTasksDone] = useState(null)

  const [windowWidth, setWindowWidth] = useState()

  useEffect(() => {
    if (window) {
      setWindowWidth(window.innerWidth)
    }
  }, [])

  useEffect(() => {
    setTasksProgress([])
    setTasksDone([])
    if (tasksStore && tasksStore.length > 0) {
      tasksStore.forEach((task) => {
        if (!task.done) {
          setTasksProgress((prev) => [...prev, task])
        } else {
          setTasksDone((prev) => [...prev, task])
        }
      })
    }
  }, [tasksStore])

  // window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <ScrollArea
      h={windowWidth < 600 ? 'calc(100vh - 260px)' : 'calc(80vh - 200px)'}
      offsetScrollbars
      scrollHideDelay={100}>
      <Box className='openers-container'>
        <NavLink
          label={
            <Text
              span
              fz='md'
              sx={(theme) => ({
                color:
                  theme.colorScheme === 'light'
                    ? '#fd7e14'
                    : theme.colors.yellow[2],
              })}>
              In progress
            </Text>
          }
          icon={''}
          childrenOffset={20}
          active
          defaultOpened
          color='yellow'
          sx={(theme) => ({
            borderRadius: theme.radius.xl,
            paddingLeft: '20px',
          })}>
          <DnD
            done={false}
            taskList={tasksProgress}
            setTaskList={setTasksProgress}
          />
        </NavLink>
        <NavLink
          label={
            <Text span fz='md'>
              Done
            </Text>
          }
          icon={''}
          childrenOffset={20}
          active
          defaultOpened
          color='green'
          sx={(theme) => ({
            borderRadius: theme.radius.xl,
            paddingLeft: '20px',
          })}>
          <DnD done={true} taskList={tasksDone} setTaskList={setTasksDone} />
        </NavLink>
      </Box>
    </ScrollArea>
  )
}
