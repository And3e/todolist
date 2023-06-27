import { useState, useEffect } from 'react'

import { ScrollArea, Box, NavLink, Text, Skeleton } from '@mantine/core'

import Element from './element'

import { useRecoilState } from 'recoil'
import { taskState } from '../../recoil_state'

export default function List() {
  const [listHeight, setListHeight] = useState()

  useEffect(() => {
    if (window) {
      setListHeight(window.innerHeight)
    }
  }, [])

  const [tasks, setTasks] = useRecoilState(taskState)

  const [progressList, setProgressList] = useState([
    <Skeleton height='40px' radius='xl' key={0} />,
  ])
  const [doneList, setDoneList] = useState([
    <Skeleton height='40px' radius='xl' key={0} />,
  ])

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressList(
        tasks
          .filter((element) => !element.done)
          .map((element) => (
            <Element key={element.id} element={element} done={false} />
          ))
      )

      setDoneList(
        tasks
          .filter((element) => element.done)
          .map((element) => (
            <Element key={element.id} element={element} done={true} />
          ))
      )
    }, 500)
    return () => clearTimeout(timer)
  }, [tasks])

  return (
    <ScrollArea
      h={(listHeight / 100) * 80 - 180}
      offsetScrollbars
      scrollHideDelay={100}>
      <Box className='openers-container'>
        <NavLink
          label={
            <Text span fz='md'>
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
          <div className='element-container'>{progressList}</div>
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
          <div className='element-container'>{doneList}</div>
        </NavLink>
      </Box>
    </ScrollArea>
  )
}
