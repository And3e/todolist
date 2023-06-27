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

export { themeState, taskState }
