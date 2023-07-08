import { useState, useEffect } from 'react'

// store
import { useRecoilState } from 'recoil'
import { taskState } from '../../../recoil_state'

import { ScrollArea, Box, NavLink, Text } from '@mantine/core'

import DnD from './dnd'

export default function List() {
  const [tasksStore, setTasks] = useRecoilState(taskState)

  const [tasksProgress, setTasksProgress] = useState([])
  const [tasksDone, setTasksDone] = useState([])

  const [listHeight, setListHeight] = useState()

  useEffect(() => {
    if (window) {
      setListHeight(window.innerHeight)
    }
  }, [])

  useEffect(() => {
    if (tasksStore && tasksStore.length > 0) {
      setTasksProgress([])
      setTasksDone([])
      tasksStore.forEach((task) => {
        if (!task.done) {
          setTasksProgress((prev) => [...prev, task])
        } else {
          setTasksDone((prev) => [...prev, task])
        }
      })
    }
  }, [tasksStore])

  // list height
  useEffect(() => {
    const handleResize = () => {
      setListHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setProgressList(
  //       tasks
  //         .filter((element) => !element.done)
  //         .map((element) => (
  //           <Element key={element.id} element={element} done={false} />
  //         ))
  //     )

  //     setDoneList(
  //       tasks
  //         .filter((element) => element.done)
  //         .map((element) => (
  //           <Element key={element.id} element={element} done={true} />
  //         ))
  //     )
  //   }, 500)
  //   return () => clearTimeout(timer)
  // }, [tasks])

  return (
    <ScrollArea
      h={(listHeight / 100) * 80 - 200}
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
