import React, { useState, useEffect } from 'react'

// d&d
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// store
import { useRecoilState } from 'recoil'
import { taskState } from '../../../recoil_state'

const _ = require('lodash')

import { Skeleton } from '@mantine/core'

// components
import Element from './element'

// setLocal

function updateList(taskList, setTaskList, result) {
  const copyList = _.cloneDeep(taskList)

  const { source, destination } = result

  let topIndex = source.index
  let bottomIndex = destination.index

  if (bottomIndex < topIndex) {
    topIndex = destination.index
    bottomIndex = source.index

    const temp = _.cloneDeep(copyList[bottomIndex])

    // console.log('temp', temp)

    // console.log('topIndex', topIndex)
    // console.log('bottomIndex', bottomIndex)

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

  console.log(copyList)
  setTaskList(copyList)
}

// update DB

async function updateDB(result, done, setTasks, setDragStatus) {
  setDragStatus(true)

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
    setDragStatus(false)
  })
}

export default function DnD({ done, taskList, setTaskList }) {
  const [tasks, setTasks] = useRecoilState(taskState)
  const [dragStatus, setDragStatus] = useState(false)

  async function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    if (result.source.index === result.destination.index) {
      return
    }

    // update local

    updateList(taskList, setTaskList, result)

    // moveTask(tasks, setTasks, startDragOrder, endDragOrder)

    updateDB(result, done, setTasks, setDragStatus)

    // let tasksList = reorder()
  }

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
                isDragDisabled={dragStatus}
                key={item.id}
                draggableId={'task-' + item.id}
                index={idx}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <Element
                      key={item.id}
                      element={item}
                      done={done}
                      dragStatus={dragStatus}
                    />
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
}
