'use client'

import { atom, selector } from 'recoil'

// LANGUAGES JSON
// en
import enOut from './locales/en-out.json'
import enIn from './locales/en-in.json'

// it
import itOut from './locales/it-out.json'
import itIn from './locales/it-in.json'

// fr
import frOut from './locales/fr-out.json'
import frIn from './locales/fr-in.json'

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

const paperState = atom({
  key: 'paperWidth',
  default: null,
})

const isEditingState = atom({
  key: 'isEditing',
  default: false,
})

// languages

const languageOutState = atom({
  key: 'selectedOutLanguage',
  default: enOut,
})

const languagesOutSelector = selector({
  key: 'languagesOutSelector',

  get: ({ get }) => get(languageOutState),
  set: ({ set }, lang) => {
    switch (lang) {
      case 'it': {
        set(languageOutState, itOut)
        break
      }
      case 'fr': {
        set(languageOutState, frOut)
        break
      }
      case 'en':
      default: {
        set(languageOutState, enOut)
      }
    }
  },
})

const languageInState = atom({
  key: 'selectedInLanguage',
  default: enIn,
})

const languagesInSelector = selector({
  key: 'languagesInSelector',

  get: ({ get }) => get(languageInState),

  set: ({ set }, lang) => {
    switch (lang) {
      case 'it':
        set(languageInState, itIn)
        break

      case 'fr':
        set(languageInState, frIn)
        break

      case 'en':
      default:
        set(languageInState, enIn)
        break
    }
  },
})

export {
  themeState,
  taskState,
  userState,
  limitTask,
  paperState,
  isEditingState,
  languagesOutSelector,
  languagesInSelector,
}
