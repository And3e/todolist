'use client'

import { atom, selector } from 'recoil'

const themeState = atom({
  key: 'themeState',
  default: 'dark',
})

const taskState = atom({
  key: 'taskState',
  default: [],
})

const limitTask = atom({
  key: 'limitTask',
  default: 50,
})

export { themeState, taskState, limitTask }
