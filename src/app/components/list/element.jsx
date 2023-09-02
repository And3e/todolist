import React, { useState, useEffect, useRef } from 'react'

// store
import { useRecoilState } from 'recoil'
import { taskState, paperState } from '@/recoil_state'

// api calls
import axios from 'axios'

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

  const [hover, setHover] = useState(false)
  const [seeBtns, setSeeBtns] = useState(false)

  const nodeRef = useRef(null)

  const [tasks, setTasks] = useRecoilState(taskState)
  const [paperWidth, setPaperWidth] = useRecoilState(paperState)

  const [inputValue, setInputValue] = useState(element.content)
  const [elementWidth, setElementWidth] = useState(
    paperWidth ? paperWidth - 191 : null
  )

  const [isLoadingEdit, setIsLoadingEdit] = useState(false)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

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

    await axios({
      url: '/api/tasks',
      method: 'patch',
      data: outElement,
    }).catch((error) => {
      console.error(error)
    })

    // update dragorder
    await axios({
      url: '/api/tasks/updatedo',
      method: 'patch',
    }).catch((error) => {
      console.error(error)
    })

    // update list
    const fetchData = await axios('/api/tasks').catch((error) => {
      console.error(error)
    })

    setTasks(fetchData.data)
  }

  async function editTask() {
    // edit task => edit content
    setIsLoadingEdit(true)

    const outElement = {
      id: element.id,
      content: inputValue,
      done: element.done,
      userId: element.userId,
      dragOrder: element.dragOrder,
    }

    await axios({
      url: '/api/tasks',
      method: 'patch',
      data: outElement,
    }).catch((error) => {
      console.error(error)
    })

    // update list
    const fetchData = await axios('/api/tasks').catch((error) => {
      console.error(error)
    })

    setTasks(fetchData.data)

    setIsLoadingEdit(false)
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

  useEffect(() => {
    if (paperWidth && window) {
      const width = window.innerWidth

      let calculatedWidth = paperWidth

      if (seeBtns) {
        calculatedWidth -= 200
      } else {
        calculatedWidth -= 150

        if (isEditing) {
          calculatedWidth -= 10
        }
      }

      if (isLoadingEdit && isLoadingDelete) {
        calculatedWidth -= 62
      } else if (isLoadingEdit) {
        calculatedWidth -= 10
      } else if (isLoadingDelete) {
        calculatedWidth -= 10
      }

      if (width < 600) {
        calculatedWidth += 15
      }

      if (width < 300) {
        calculatedWidth += 20
      }

      setElementWidth(calculatedWidth)
    }
  }, [paperWidth, seeBtns, isLoadingEdit, isLoadingDelete, isEditing])

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
                  <GripVertical
                    size={17}
                    width={20}
                    style={{ color: isEditing ? '#fea869' : null }}
                  />
                  <TextInput
                    placeholder={element.content}
                    variant='unstyled'
                    radius='md'
                    className='edit-field'
                    value={inputValue}
                    style={{
                      width: elementWidth + 16,
                    }}
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
                  <GripVertical size={17} width={20} />
                  <Text
                    id='#text#'
                    span
                    fz='md'
                    className='element-text'
                    c={done ? 'dimmed' : ''}
                    td={done ? 'line-through' : ''}>
                    <div
                      id='#text#'
                      style={{
                        width: elementWidth,
                        overflowWrap: 'break-word',
                      }}>
                      {isLoadingEdit ? inputValue : element.content}
                    </div>
                  </Text>
                </Box>
              )}

              <div className='btns-container'>
                {seeBtns || isLoadingEdit ? (
                  <EditBtn
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    handleEdit={handleEdit}
                    isLoading={isLoadingEdit}
                    isDisabled={isLoadingDelete}
                  />
                ) : null}

                {(seeBtns && !isEditing) || isLoadingDelete ? (
                  <DeleteBtn
                    element={element}
                    isLoading={isLoadingDelete}
                    setIsLoading={setIsLoadingDelete}
                    isDisabled={isLoadingEdit}
                  />
                ) : null}
              </div>
            </Box>
          </div>
        )
      }}
    </Transition>
  )
}
