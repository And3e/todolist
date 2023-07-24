import React, { useState, useEffect, useRef } from 'react'

// store
import { useRecoilState } from 'recoil'
import { taskState } from '../../../recoil_state'

import { Box, Text, TextInput } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'
import { GripVertical } from 'react-bootstrap-icons'

import DeleteBtn from '../btns/deletebtn'
import EditBtn from '../btns/editbtn'

import { Transition } from 'react-transition-group'

const duration = 400

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
}

export default function Element({ element, done }) {
  const [isClicked, setIsClicked] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [inputValue, setInputValue] = useState(element.content)

  const [hover, setHover] = useState(false)
  const [seeBtns, setSeeBtns] = useState(false)

  const nodeRef = useRef(null)

  const [tasks, setTasks] = useRecoilState(taskState)

  // api requests
  async function setDone() {
    const count = tasks.filter((obj) => obj.done === !done).length

    // edit task => set done
    const outElement = {
      id: element.id,
      content: element.content,
      done: !done,
      dragOrder: count + 1,
      userId: element.userId,
    }

    await fetch('/api/tasks', {
      method: 'PATCH',
      body: JSON.stringify(outElement),
    })

    // update dragorder
    await fetch('/api/tasks/updatedo', {
      method: 'PATCH',
      body: JSON.stringify({
        done: done,
      }),
    })

    // update list
    const fetchData = await fetch('/api/tasks')

    setTasks(await fetchData.json())
  }

  async function editTask() {
    // edit task => edit content
    const outElement = {
      id: element.id,
      content: inputValue,
      done: element.done,
      userId: element.userId,
      dragOrder: element.dragOrder,
    }

    await fetch('/api/tasks', {
      method: 'PATCH',
      body: JSON.stringify(outElement),
    })

    // update list
    const fetchData = await fetch('/api/tasks')

    setTasks(await fetchData.json())
  }

  function handleEdit() {
    if (inputValue != element.content && inputValue.length > 0) {
      editTask()
    }

    setIsEditing(false)
  }

  // per responsive
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleResize = () => {
    const width = window.innerWidth
    setSeeBtns(width < 800 || hover)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(handleResize, [hover])

  // check provenienza click (btns || parent element)
  function handleClick(event) {
    if (event.target.id != '' && !isEditing) {
      setDone()
      setIsClicked(true)
    }
  }

  // style
  function getStyle(theme) {
    return {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      borderRadius: theme.radius.xl,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.gray[1],
      },
    }
  }

  return (
    <Transition
      in={isClicked || isMounted}
      nodeRef={nodeRef}
      timeout={duration}
      onExited={() => {
        setIsClicked(false)
        setIsMounted(false)
      }}>
      {(state) => {
        const transitionStyles = isClicked
          ? {
              entering: { opacity: 0 },
              entered: { opacity: 0 },
              exiting: { opacity: 1 },
              exited: { opacity: 1 },
            }
          : {
              entering: { opacity: 1 },
              entered: { opacity: 1 },
              exiting: { opacity: 0 },
              exited: { opacity: 0 },
            }

        return (
          <div
            ref={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}>
            <Box
              className='element'
              id='#element#'
              sx={(theme) => getStyle(theme)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={handleClick}>
              {isEditing ? (
                <Box className='icon-element-conainter' id='#text-input#'>
                  <GripVertical size={17} />
                  <TextInput
                    placeholder={element.content}
                    variant='unstyled'
                    radius='md'
                    className='edit-field'
                    value={inputValue}
                    onChange={(event) =>
                      setInputValue(event.currentTarget.value)
                    }
                    onKeyDown={getHotkeyHandler([
                      ['Enter', () => handleEdit()],
                    ])}
                  />
                </Box>
              ) : (
                <Box className='icon-element-conainter' id='#text#'>
                  <GripVertical size={17} />
                  <Text
                    id='#text#'
                    span
                    fz='md'
                    className='element-text'
                    c={done ? 'dimmed' : ''}
                    td={done ? 'line-through' : ''}>
                    {element.content}
                  </Text>
                </Box>
              )}

              {seeBtns ? (
                <div className='btns-container'>
                  <EditBtn
                    element={element}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    inputValue={inputValue}
                    editTask={editTask}
                    handleEdit={handleEdit}
                  />
                  {!isEditing ? <DeleteBtn element={element} /> : null}
                </div>
              ) : null}
            </Box>
          </div>
        )
      }}
    </Transition>
  )
}
