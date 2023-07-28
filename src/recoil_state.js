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

const userState = atom({
  key: 'userState',
  default: null,
})

const limitTask = atom({
  key: 'limitTask',
  default: 50,
})

export { themeState, taskState, userState, limitTask }
