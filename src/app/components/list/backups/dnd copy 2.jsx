import React, { useState } from 'react'

// d&d
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// store
import { useRecoilState } from 'recoil'
import { taskState } from '../../../../recoil_state'

const _ = require('lodash')

import { Skeleton } from '@mantine/core'

// components
import Element from '../element'

// setLocal

function updateTasks(tasks, setTasks, startIndex, endIndex) {
  const subArray = tasks.slice(startIndex, endIndex + 1)

  const shiftedContent = subArray[subArray.length - 1].content

  // Shift the content by one position
  for (let i = subArray.length - 1; i > 0; i--) {
    subArray[i].content = subArray[i - 1].content
  }

  subArray[0].content = shiftedContent

  const finalArray = _.cloneDeep(tasks)

  finalArray.splice(startIndex, subArray.length, ...subArray)

  setTasks(finalArray)
}

function moveTask(tasks, setTasks, startDragOrder, endDragOrder) {
  let tasksList = _.cloneDeep(tasks)

  let startIndex = null
  let endIndex = null

  // find start/end indexes
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].dragOrder === startDragOrder) {
      startIndex = i
    }
    if (tasks[i].dragOrder === endDragOrder) {
      endIndex = i
    }
  }

  if (startIndex > endIndex) {
    let temp = startIndex
    startIndex = endIndex
    endIndex = temp
  }

  // find start/end indexes
  for (let i = 0; i < tasksList.length; i++) {
    if (tasksList[i].dragOrder === startDragOrder) {
      startIndex = i
    }
    if (tasksList[i].dragOrder === endDragOrder) {
      endIndex = i
    }
  }

  if (startIndex > endIndex) {
    let temp = startIndex
    startIndex = endIndex
    endIndex = temp
  }

  if (startIndex === null || endIndex === null) {
    return res.status(404).json({ message: 'Task not found' })
  }

  updateTasks(tasksList, setTasks, startIndex, endIndex)
}

// update DB

async function updateDB(taskList, result, tasks, setTasks, setDragStatus) {
  const orderedList = _.cloneDeep(taskList)

  if (orderedList) {
    let startDragOrder = orderedList[result.source.index].dragOrder

    let endDragOrder = orderedList[result.destination.index].dragOrder

    // update local
    moveTask(tasks, setTasks, startDragOrder, endDragOrder)

    setDragStatus(true)

    // edit task => edit dragOrder
    await fetch('/api/tasks/move', {
      method: 'PATCH',
      body: JSON.stringify({
        startDragOrder: startDragOrder,
        endDragOrder: endDragOrder,
      }),
    }).then(async () => {
      // update list
      const fetchData = await fetch('/api/tasks')

      setTasks(await fetchData.json())
      setDragStatus(false)
    })
  }
}

export function DnD2({ done, taskList }) {
  const [tasks, setTasks] = useRecoilState(taskState)
  const [dragStatus, setDragStatus] = useState(false)

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = tasks[source.droppableId]
      const destColumn = tasks[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      setTasks({
        ...tasks,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    } else {
      const column = tasks[source.droppableId]

      console.log('console.log(column)', column)
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setTasks({
        ...tasks,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
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

const DnD = ({ done, taskList, setTaskList }) => {
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, taskList, setTaskList)}>
      <div>
        <div>
          {Object.entries(taskList).map(([columnId, column], index) => {
            return (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <h1>{column.title}</h1>
                    {column.items.map((item, index) => (
                      <Element key={item} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
      </div>
    </DragDropContext>
  )
}

export default DnD
