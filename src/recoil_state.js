'use client'

import { atom, selector } from 'recoil'

// en
import enOut from './locales/en-out.json'
import enIn from './locales/en-in.json'

// it
// import itOut from './locales/en-out.json'
// import itIn from './locales/en-in.json'

// fr
// import frOut from './locales/en-out.json'
// import frIn from './locales/en-in.json'

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
      // case 'it':
      //   set(languageOutState, itOut)
      //   return itOut

      // case 'fr':
      //   set(languageOutState, frOut)
      //   return itOut

      case 'en':
      default:
        set(languageOutState, enOut)
        return enOut
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
      // case 'it':
      //   set(languageInState, itIn)
      //   return itIn

      // case 'fr':
      //   set(languageInState, frIn)
      //   return itIn

      case 'en':
      default:
        set(languageInState, enIn)
        return enIn
    }
  },
})

export {
  themeState,
  taskState,
  userState,
  limitTask,
  paperState,
  languagesOutSelector,
  languagesInSelector,
}
