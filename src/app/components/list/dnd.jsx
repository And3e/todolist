import React, { useState, useEffect, useRef } from 'react'

// d&d
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// store
import { useRecoilState } from 'recoil'
import { taskState } from '../../../recoil_state'

const _ = require('lodash')

import { Skeleton } from '@mantine/core'

// components
import Element from './element'

export default function DnD({ done, taskList, setTaskList }) {
  const [tasks, setTasks] = useRecoilState(taskState)

  // da spostare in list (coordinazione con done/!done lists)
  const [toDB, setToDB] = useState([])
  const draggingTimerRef = useRef(null)

  // update DB
  // versione a richiesta singola
  /*
  async function updateDB(result) {
    const { source, destination } = result

    let topIndex = source.index
    let bottomIndex = destination.index

    // edit task => edit dragOrder
    await fetch('/api/tasks/move', {
      method: 'PATCH',
      body: JSON.stringify({
        topIndex: topIndex,
        bottomIndex: bottomIndex,
        done: done,
      }),
    }).then(async () => {
      // update list
      const fetchData = await fetch('/api/tasks')

      setTasks(await fetchData.json())
    })
  }
  */

  // update DB
  async function updateDB(list) {
    // edit task => edit dragOrder
    await fetch('/api/tasks/move', {
      method: 'PATCH',
      body: JSON.stringify(list),
    }).then(async () => {
      // update list
      const fetchData = await fetch('/api/tasks')

      setTasks(await fetchData.json())
    })
  }

  // setLocal
  function updateList(result) {
    const copyList = _.cloneDeep(taskList)

    const { source, destination } = result

    let topIndex = source.index
    let bottomIndex = destination.index

    if (bottomIndex < topIndex) {
      // console.log('sotto a sopra')
      topIndex = destination.index
      bottomIndex = source.index

      const temp = _.cloneDeep(copyList[bottomIndex])

      for (let i = bottomIndex; i > topIndex; i--) {
        copyList[i].content = copyList[i - 1].content
      }

      copyList[topIndex].content = temp.content
    } else {
      // console.log('sopra a sotto')

      const temp = _.cloneDeep(copyList[topIndex])

      for (let i = topIndex; i < bottomIndex; i++) {
        copyList[i].content = copyList[i + 1].content
      }

      copyList[bottomIndex].content = temp.content
    }

    // console.log(copyList)
    setTaskList(copyList)
  }

  useEffect(() => {
    if (toDB.length > 0) {
      draggingTimerRef.current = setTimeout(async () => {
        await updateDB(toDB)
        setToDB([])
      }, 3000)
    }
  }, [toDB])

  function handleDB(result) {
    const { source, destination } = result

    setToDB((prev) => [
      ...prev,
      { topIndex: source.index, bottomIndex: destination.index, done: done },
    ])

    clearTimeout(draggingTimerRef.current)
  }

  async function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    if (result.source.index === result.destination.index) {
      return
    }

    // update local
    updateList(result)

    // update db
    // updateDB(result)
    handleDB(result)
  }

  if (taskList !== null) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'droppable'}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='element-container'>
              {taskList.map((item, idx) => (
                <Draggable
                  key={item.id}
                  draggableId={'task-' + item.id}
                  index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <Element key={item.id} element={item} done={done} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  } else {
    return <Skeleton h='44.79px' radius='xl' />
  }
}
